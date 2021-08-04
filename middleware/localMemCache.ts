/* eslint-disable @typescript-eslint/no-explicit-any */

type Cache = {
  data: any[]
  lastUpdated: Date 
  isLoading: boolean
} | undefined

const localMemCache: {[key: string]: Cache} = {}

const putCache = async (key: string, fallback: () => Promise<any[]>) => { 
  // this method may be called in parallel, so await only call the db for the first request to update cache
  if(!localMemCache[key]?.isLoading ?? false){
    const prevState = localMemCache[key] 

    localMemCache[key] = prevState 
     // if cache was prev defined, use previous state and set 
    ? {...prevState, isLoading: true} 
    // otherwise, set state to null and loading
    : {data: null, lastUpdated: null, isLoading: true}

    const data = await fallback()

    localMemCache[key] = {
      lastUpdated: new Date(),
      isLoading: false,
      data,
    }

    return data
  }

  // when a db req to update the cache is loading, hold the other requests against the cache until the first one completes
  do {
    await new Promise(resolve => setTimeout(() => resolve(true), 500))
  } while(
    localMemCache[key].isLoading
  )

  return localMemCache[key].data
}

// was the cache updated less than "seconds" ago?
const isCacheStale = (lteSeconds: number, key:string):boolean => {
  const lastUpdated = localMemCache[key]?.lastUpdated ?? null

  if(!lastUpdated){return true}
  
  if(Date.now() - lastUpdated.getTime() >= lteSeconds * 1000){return true}

  return false
}

// Try to read from the cache first.
// Return fallback if cache is stale or non existent.
// Then use fallback to update cache.
// Note: this cache is not to be used queries that rely on user roles
export const useLocalMemCache = async <T>(
  {
    lteSeconds = 2, 
    key,
    fallback
  }: 

  {
    lteSeconds?: number,
    key:string,
    fallback: () => Promise<T>
  }): Promise<T> => {

    const isStale = isCacheStale(lteSeconds, key)

    if(!isStale){
      return localMemCache[key].data as any
    }

    return putCache(key, (fallback) as any) as any
}