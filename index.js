const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const url = require("url");
const path = require("path");

let mainWindow;
let searchWindow;
let historyWindow;

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

  // Quit app when closed
  mainWindow.on("closed", () => {
    app.quit();
  });

  // Build menu from template
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  // Insert menu
  Menu.setApplicationMenu(mainMenu);
});

// Create search window
createSearchWindow = () => {
  // Create new window
  searchWindow = new BrowserWindow({
    width: 300,
    height: 200,
    title: "Search History",
    webPreferences: {
      nodeIntegration: true
    }
  });

  // Load html into window
  searchWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "/app/components/searchWindow.html"),
      protocol: "file:",
      slashes: true
    })
  );

  // Garbage collection handle
  searchWindow.on("close", () => {
    searchWindow = null;
  });
};

// Create history window
createHistoryWindow = () => {
  // Create new window
  historyWindow = new BrowserWindow({
    width: 800,
    height: 500,
    title: "History",
    webPreferences: {
      nodeIntegration: true
    }
  });

  // Load html into window
  historyWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "/app/components/historyWindow.html"),
      protocol: "file:",
      slashes: true
    })
  );

  // Garbage collection handle
  historyWindow.on("close", () => {
    historyWindow = null;
  });
};

// Catch history:table
ipcMain.on("history:table", (e, item) => {
  createHistoryWindow();
  historyWindow.tableNum = item;
  searchWindow.close();
});

// Create menu template
const mainMenuTemplate = [
  {
    label: "File",
    submenu: [
      {
        label: "Search History",
        click() {
          // Search window pops up
          createSearchWindow();
        }
      },
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
