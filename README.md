# 3D Navigation Website

This project demonstrates a 3D navigable plane with a dotted path, allowing users to move through a 3D world using arrow keys. Nodes along the path feature thumbnails that can be interacted with to display more detailed information. The project now includes a Game Center with an integrated Tetris game.

## Features

- 3D environment created with Three.js
- Navigable path using arrow keys
- Placards with thumbnails at each node
- Detailed information modal for each node
- Debug information display
- Responsive design
- Modular architecture using ES6 modules
- Game Center with an integrated Tetris game
- Menu system for game selection

## Project Structure

The project uses a modular structure with ES6 modules:

- `js/app.js`: Main application orchestrator
- `js/sceneManager.js`: Manages the 3D scene and Tron-style effects
- `js/pathManager.js`: Handles path and node management
- `js/navigationManager.js`: Manages navigation along the path
- `js/uiManager.js`: Handles UI elements like placard, menu, and terminal
- `js/tetrisManager.js`: Manages the integrated Tetris game
- `js/pathData.js`: Contains the path and node data
- `js/constants.js`: Stores constant values used across the application
- `tetris.js`: Tetris game implementation
- `index.html`: Main HTML file
- `styles.css`: CSS styles for the application
- `start_server.py`: Python script to start a local server

## How to Run

1. Ensure you have Python installed on your system (Python 3.x is recommended).
2. Navigate to the project directory in your terminal or command prompt.
3. Run the following command to start the local server:

   ```
   python start_server.py
   ```

   If you're using Python 2.x, you may need to use `python -m SimpleHTTPServer` instead.

4. Open your web browser and go to `http://localhost:8000`.

If you don't have Python installed, you can use any other local server of your choice.

## How to Use

- Use the Up Arrow key to move forward along the path.
- Use the Down Arrow key to turn around.
- Press Enter to view detailed information about the current node.
- Press Space to open the navigation menu.
- Use number keys (0-9) to quickly navigate to specific nodes.
- When at the Game Center node:
  - Press Enter to open the game menu.
  - Use number keys to select a game (currently, only Tetris is available).
- In the Tetris game:
  - Use arrow keys to move and rotate pieces.
  - Press Escape to exit the game and return to the game menu.
- Press Escape to close placards or exit menus.
- Observe the debug information in the terminal for current position and node details.

## Testing and Troubleshooting

To ensure everything is working correctly, follow these steps:

1. Open the browser's developer console (usually F12 or right-click and select "Inspect").
2. Refresh the page and check for any error messages in the console.
3. Verify that you can see a 3D scene with a Tron-style grid and effects.
4. Look for a glowing path and node representations.
5. Try using the arrow keys and observe the following:
   - The camera should smoothly move to new positions along the path.
   - The terminal should update with new node information.
   - Console logs should appear for each key press.
6. Navigate to the Game Center node and verify that:
   - Pressing Enter opens the game menu.
   - You can select and start the Tetris game.
   - The Tetris game is playable and can be exited with the Escape key.
7. Try to reach the end of the path by pressing the Up Arrow key multiple times. The movement should stop at the last node.

If you encounter any issues:

- Make sure all required scripts are properly loaded. Check the console for any related errors.
- Verify that all files are in the correct location and have the right content.
- Try clearing your browser cache and reloading the page.
- If using Chrome, test in an Incognito window to rule out extension conflicts.
- Ensure you're running the application through the local server and not directly from the file system.

## Reporting Issues

If you continue to experience problems after following the troubleshooting steps, please provide the following information:

1. A description of the issue you're experiencing.
2. Any error messages from the browser console.
3. The browser and operating system you're using.
4. Screenshots of the 3D scene and terminal information, if possible.
5. The contents of the terminal when the issue occurs.

With this information, we can further diagnose and resolve any remaining issues.

Thank you for your help in testing and improving this 3D navigation website!