const inquirer = require("inquirer");
const db= require("/config/connection.js");
const table = require('console.table');

//use inquirer to create prompts for user's selections
const appTrigger= () => {
    inquirer.prompt([
        {
            type: "list",
            name: "choice",
            message: "What would you like to do? Select one option from dropdown",
            choices: [
                'View all departments?',
                "View all roles?",
                "View all employees?",
                "Add a department?",
                "Add a role?",
                "Add an employee?",
                "Update an employee's role?",
                "Update an employee's manager?",
                "Exit"
            ]
        }
    ])

    // use .then to ensure inquirer prompts running correctly before starting new prompt functions
    .then(userInput => {
        const newPrompt = userInput.choice;
        if (newPrompt === "View all departments?") {
            openDepts();
        };
    // use boolean to determine which function will be used corresponding to user's selections
        if (newPrompt === "View all roles?") {
            openRoles();
        };

        if (newPrompt === "View all employees?") {
            openEmployees();
        };

        if  (newPrompt === "Add a department?") {
            addDept();
        };

        if (newPrompt === "Add a role?") {
            addRole();
        };

        if (newPrompt === "Add an employee?") {
            addEmployee();
        };

        if (newPrompt === "Update an employee's role?") {
            updateRole();
        };

        if (newPrompt === "Update an employee's manager?") {
            updateManager();
        };

        if (newPrompt === "Exit") {
            process.exit();
        };
    })
};

// create functions for openDepts, openRoles, openEmployees, updateRole, updateManager
// 1. openDepts
const openDepts = () => {
    const sql= "SELECT * FROM departments";
    db.query(sql, (err, rows) => {
        if (err) {
            throw err;
        }
        console.log("\n");
        console.table(rows);
        return appTrigger();
    });
};

// https://www.w3schools.com/mysql/mysql_join_left.asp#:~:text=The%20LEFT%20JOIN%20keyword%20returns,the%20right%20table%20(table2).
// 2. openRoles

const openRoles = () => {
    const sql= 
    `SELECT 
    roles.id,
    roles.title,
    roles.slary,
    departments.name AS departments 
    FROM roles
    LEFT JOIN departments ON roles.department_id =departments.id`;
    db.query(sql, (err, rows) => {
        if (err) {
            throw err;
        }
        console.log("\n");
        console.table(rows);
        return appTrigger();
    });
};

// 3. openEmployees

const openEmployees = () => {
    const sql = 
    `SELECT
    employees.id,
    employees.first_name,
    employees.last_name,
    roles.title AS title,
    roles.salary AS salary,
    departments.name AS department,
    + (manager.first_name, " ", manager.last_name) AS manager
    FROM employees
    LEFT JOIN roles ON employees.role_id =roles.id
    LEFT JOIN departments ON roles.department_id = departments.id
    LEFT JOIN employees manager ON employees.manager_id = manager.id`
    db.query(sql, (err, rows) => {
        if (err) {
            throw err;
        }
        console.log("\n");
        console.table(rows);
        return appTrigger();
    });
};

//  addDept, addRole, addEmployee,
// 4. addDept
const addDept = () => {
    return inquirer.prompt([
        {
            type: "input",
            name: "deptName",
            message: "What would you like the new department to be called?",
        }
    ])
.then(newDept => {
    const sql = "INSERT INTO departments (name) VALUES (?)";
    const params =newDept.name;
    db.query(sql, params, (err) => {
        if (err) {
            throw err;
        }
    console.log("A new department has been added!");
    return openDepts();
    });
});
};

// 5. addRole

const addRole = () => {
    return inquirer.prompt([
        {
            type: "input",
            name: "roleTitle",
            message: "what would this new role be called?",
        },
        {
            type: "input",
            name: "salary",
            message: "what is the salary for this new role? (numbers only)",
        }
    ])
.then (newRole => {
    const params = [newRole.title, newRole.salary];
    const sql = "SELECT * FROM departments";
    db.query(sql, (err, rows) => {
        if (err) {
            throw err;
        }
    const departments = rows.map (({name, id}) => ({name: name, value: id}));
    inquirer.prompt([
        {
            type: "list",
            name: "department",
            message: "Which department will this role be listed under?",
            choices: departments
        }
    ])
    .then(departmentSelect => {
        const department = departmentSelect.department;
        params.push(department);
        const sql = "INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)";
        db.query(sql, params, (err) => {
            if (err) {
                throw err;
            }
            console.log("A new role has been added!");
            return openRoles();
         });
        });
      });
   });
};






module.exports =appTrigger;