# Solo-Sockets

An attempt at implementing webSockets in a browser based 2 player game. Super Robot Programmer is a 2 player turnbased game where players choose three actions for their robots to take. 
These actions are carried out at the same time. Players need to anticipate what their opponent is planning and come up with a counterplan to win.
The game is carried out over a websocket server and keeps track of registered players and their user name, wins, and losses in a database.


The project contains a server and client solution. The server serves a static version of the client. In order to run the project, one should only need to run server file.

The project uses React/TypeScript on the client side, and express on the server. The server also uses Knex, along with express-session-knex to interact with the psql database.
The websocket is set up with express-ws.
