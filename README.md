# Careers and Competitions

A dynamic listing of various careers and competitions.


## Requirements

* Visual Studio 2022
* An up-to-date browser
* Internet access
* ASP.NET Core 7
* Node.js 18 or later


## Installation Instructions

1. Download the repo and open the solution in Visual Studio
2. Goto `Tools ` > `Nuget Package Manager ` > `Manage Nuget Packages for Solution...` and install the packages
3. Open terminal in the `ClientApp` folder and run `npm i`


## Scaffolding and Seeding the database

1. Create a SQL Server and obtain a connection string
2. Replace the `DefaultConnection` value in `appsettings.json` with the connection string you obtained from the previous step
3. Open Visual Studio and navigate to the `Package Manager Console`
4. Run `Update-Database`
5. The database will then need to be manually seeded with the values found in `Industries.cs` and `Kontests.cs`
6. Optionally change the code in those files to match the ID values in your database


## Running the Solution

1. Open the solution in Visual Studio
2. Click the "Play" button
3. You should see a new browser window open, wait for it to change from "Waiting for SPA" to the frontpage

Any changes made in the `ClientApp` folder will automatically change the website, barring any package changes. If no change was seen, simply refresh the page.

Any changes made to the server will need a program restart. Simply hit the "backwards refresh" button to restart it or hit the "stop" button to stop the program before starting it again.
