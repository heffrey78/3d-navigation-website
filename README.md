# 3D Navigation Website

This project demonstrates a 3D navigable plane with a dotted path, allowing users to move through a 3D world using arrow keys. Nodes along the path feature thumbnails that can be interacted with to display more detailed information.

## Features

- 3D environment created with Three.js
- Navigable path using the Up Arrow key
- Placards with thumbnails at each node
- Detailed information modal for each node
- Debug information display
- Responsive design

## How to Run

1. Ensure you have a modern web browser installed (Chrome, Firefox, Safari, or Edge).
2. Navigate to the project directory in your terminal or command prompt.
3. Start a local server. You can use Python's built-in HTTP server if you have Python installed:

   For Python 3.x:
   ```
   python -m http.server
   ```

   For Python 2.x:
   ```
   python -m SimpleHTTPServer
   ```

   If you don't have Python installed, you can use any other local server of your choice.

4. Open your web browser and go to `http://localhost:8000` (or whatever port your local server is using).

## How to Use

- Use the Up Arrow key to move forward along the path.
- Press Enter to view detailed information about the current node.
- Observe the debug information in the top-left corner for current position and node details.

## Testing and Troubleshooting

To ensure everything is working correctly, follow these steps:

1. Open the browser's developer console (usually F12 or right-click and select "Inspect").
2. Refresh the page and check for any error messages in the console.
3. Verify that you can see a 3D scene with a brown ground plane and a blue sky.
4. Look for a white dotted line representing the path and rectangular placards for each node.
5. Try using the Up Arrow key and observe the following:
   - The camera should smoothly move to new positions along the path.
   - The debug info in the top-left corner should update with new node information.
   - Console logs should appear for each key press.
6. If the Up Arrow key doesn't seem to work:
   - Click on the webpage to ensure it has focus.
   - Check if the console logs appear when pressing the key. If not, there might be an issue with the event listener.
7. Press Enter when on a node to check if the modal with detailed information appears.
8. Try to reach the end of the path by pressing the Up Arrow key multiple times. The movement should stop at the last node.

If you encounter any issues:

- Make sure Three.js is properly loaded. Check the console for any related errors.
- Verify that all files (index.html, main.js, styles.css) are in the correct location and have the right content.
- Try clearing your browser cache and reloading the page.
- If using Chrome, test in an Incognito window to rule out extension conflicts.

## Reporting Issues

If you continue to experience problems after following the troubleshooting steps, please provide the following information:

1. A description of the issue you're experiencing.
2. Any error messages from the browser console.
3. The browser and operating system you're using.
4. Screenshots of the 3D scene and debug information, if possible.
5. The contents of the debug information panel when the issue occurs.

With this information, we can further diagnose and resolve any remaining issues.

Thank you for your help in testing and improving this 3D navigation website!