The admin endpoint will be used to perform crud operation on aircraft.users. 

Roles are specific to each Aircraft. For example a user may have role 3 on the the c-17a, but they only role 2 on the c-130. However, the DB will only allow an email one role per aircraft.
Each request will validate the users role for the aircraft they are trying to perform crud on. 

To validate a users role for an aircraft use service.isRoleAtAircaft

role 0: 
role 1: r general, r aircraft
role 2: r general, r aircraft cud aircraft.user if request.aircraft.user.role <= 2
role 3: r general, crud aircraft

no role will be able to crud genral, general will be seeded with instuctions that are fed to the ui based on each users highest role