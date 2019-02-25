const { app, BrowserWindow, Menu } = require("electron");
const url = require("url");
const path = require("path");

let mainWindow;

// Listen for app to be ready
app.on("ready", () => {
  // Create new window
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      nodeIntegration: true
    }
  });
  // Load html into window
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "/app/components/mainWindow.html"),
      protocol: "file:",
      slashes: true
    })
  );

  // Build menu from template
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  // Insert menu
  Menu.setApplicationMenu(mainMenu);
});

// Create menu template
const mainMenuTemplate = [
  {
    label: "File",
    submenu: [
      {
        label: "Quit",
        accelerator: process.platform === "darwin" ? "Command+Q" : "Ctrl+Q",
        click() {
          app.quit();
        }
      }
    ]
  }
];

// If mac, add empty object to menu
if (process.platform === "darwin") {
  mainMenuTemplate.unshift({});
}

// Add developer tools item if not in production mode
if (process.env.NODE_ENV !== "production") {
  mainMenuTemplate.push({
    label: "Developer Tools",
    submenu: [
      {
        label: "Toggle DevTools",
        accelerator: process.platform === "darwin" ? "Command+I" : "Ctrl+I",
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        }
      },
      {
        role: "reload"
      }
    ]
  });
}
