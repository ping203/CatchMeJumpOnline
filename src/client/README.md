All client related logic is stored here.
Clients only hold render relevant information and logic (physics, movement) is calculated on the server.

Thus, code is separated according to the model, view, controller (MVC) pattern.
The world contains everything a client needs for rendering:
- Players
- Effects on players
- Tiles
- Items

The game server colyseus is used for client server communication.