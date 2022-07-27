In our case, I believe that having hardcoded data will be beneficial if we later move this data to the database.
What makes the app more dynamic. In the event that we need to add, change, or delete fields.

The disadvantage is that if we lose our API, our form will crash.

According to the question, I assume that different levels of stack are client side, file system and database.
Some basic data that does not need to be secure can be saved on the client side or in the file system.
For example, we can save a client's feedback of his name, country, and so on as a file; 
If the information we request needs to be secure, we will use a database.
For instance, if you want to send an email, save the client's login and password, display information only to the client, and etc.
