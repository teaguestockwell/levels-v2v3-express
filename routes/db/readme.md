the db endpoint is for use by database admins that will perform crud ops on aircraft, adn thier children objects within the databse

the db route will not be acsessible by the ui without the proper general role apon ui init request to general endpoint

to prevent unathorized accses not from the ui, before any endpoint within this folder performs crud, use service.isRoleOfAircraft to verify request has permision 
