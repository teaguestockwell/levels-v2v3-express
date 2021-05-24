# Plan of Action for Atlas
## Atlas, MVP and Beyond

* **Kick-off Date:**
2021-02-21
* **Inception Date:**
2020-12-07
* **MVP Date:**
2021-06-15
#### Vision
Make aircraft cargo loading / weight and balance extensible for mission needs
#### Strategy
While methods exist for loadmasters, they are not maintainable, require extensive training to implement and are not suited for all aircraft or use cases. Atlas's strategy is to deliver an extensible platform for weight and balance / cargo loading.
#### Summary
Calculating %MAC for the most basic config takes a qualified maintenance technician an average of 12 minutes per attempt, and 1.5 attempts for the correct answer. When we encounter a math problem in our day to day lives we use a calculator to solve it. Our goal is to create an app that serves as a weight and balance calculator for the C-17 loadmaster, and maintainer that is maintainable and extensible to other aircraft.
### Goals and Metrics
A dashboard to calculate weight and balance for aircraft, configurations, and cargo.
A glossary for reference and learning about common weight and balance terminology.
An admin portal that allows validated CRUD ops to admins for app data.
**Release Focus**  
- Aircraft weight and balance
**Release Functionality** 
- Provides aircraft maintenance with a tool for weight and balance
**System Integration Considerations** 
- Integrates with the continuous ATO pipeline 
- Integrates with DB for data persistance
- integrates with api for user roles, and data abstraction 
- Integrates with keycloak for user authorization