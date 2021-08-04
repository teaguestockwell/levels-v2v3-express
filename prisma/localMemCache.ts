/* eslint-disable @typescript-eslint/no-explicit-any */
const cache: {
  [key: string]: {
    data: any[]
    lastUpdated: Date
    isLoading: boolean
  }
} = {}

// was the cache updated less than or equal to "seconds" ago?
const isCacheStale = (key: string): boolean => {
  const lastUpdated = cache[key]?.lastUpdated ?? null

  if (!lastUpdated) {
    return true
  }

  if (Date.now() - lastUpdated.getTime() >= 5000) {
    return true
  }

  return false
}

// try to read from the cache first.
// return fallback if cache is stale or non existent.
// then use fallback to update cache.
// note: this cache is not to be used queries that are scoped to user roles
export const localMemCache = async <T>({
  key,
  fallback,
}: {
  key: string
  fallback: () => Promise<T>
}): Promise<T> => {

  // return from cache if its defied and not state
  if (!isCacheStale(key)) {
    return cache[key].data as any
  }

  // this method may be called in parallel, so await only for the first request to update cache
  if (!cache[key]?.isLoading ?? false) {

    // spread over inital state to ensure all props get defined
    cache[key] = {
      data: null,
      lastUpdated: null,
      ...cache[key],
      isLoading: true
    }

    const data = await fallback()

    // update the cache once the fallback db call resolves
    cache[key] = {
      lastUpdated: new Date(),
      isLoading: false,
      data: data as any,
    }

    return data
  }

  // when a db req to update the cache is loading, 
  // wait for the first request to update the cache to avoid making duplicate db calls
  for (let i = 0; i < 30; i++) {

    // return from cache once it loads
    if(!cache[key].isLoading && !isCacheStale(key)){
      return cache[key].data as any
    }

    await new Promise((resolve) => setTimeout(() => resolve(true), 500))
  } 

  throw new Error(`timeout waiting for ${key} to resolve in localMemCache`)
}