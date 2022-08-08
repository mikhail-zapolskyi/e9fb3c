In our case, I believe that having hardcoded data will be beneficial if we later move this data to the database.
What makes the app more dynamic. In the event that we need to add, change, or delete fields.

Is it efficient to save the steps data in the DB?
Is it efficient and it is easier to maintain, has fewer chances of error, and can read once on startup and then cache/save in the application.

The disadvantage is that if we lose our API, our form will crash.

According to the question, I assume that different levels of stack are client side, file system and database.
Some basic data that does not need to be secure can be saved on the client side or in the file system.
For example, we can save a client's feedback of his name, country, and so on as a file; 
If the information we request needs to be secure, we will use a database.
For instance, if you want to send an email, save the client's login and password, display information only to the client, and etc.

Here, you misunderstood the question; here we meant that where would you prefer to save the steps onboarding data; which is currently hardcoded and used to build steps in the frontend.

While developing form I would keep data hard coded. And for production app I would have steps data saved to database. 


The POST route is not saving the user information even if all field data is correct.
I tested the route and checked db after I save it. And can see the user and updates. If I am wrong can you please direct me so I can 
where I am fail. 
