const inquirer = require("inquirer");
const db= require("./db/connection");
require('console.table');

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
    const sql= `SELECT * FROM departments`;
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
    CONCAT (manager.first_name, " ", manager.last_name) AS manager
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

const addEmployee = () => {
    return inquirer.prompt([
        {
            type: "input",
            name: "firstName",
            message: "Please enter employee's first name!",
            validate: nameInput => {
                if (nameInput) {
                    return true;
                } else {
                    console.log("please enter employee's first name");
                    return false;
                };
                }
            },{
            type: "input",
            name: "lastName",
            message: "Please enter employee's last name?",
            validate: nameInput => {
                if (nameInput) {
                    return true;
                } else {
                    console.log("Please enter employee's last name");
                    return false;
                };
            }
         }
        ])
        .then(answer => {
            const params = [answer.firstName, answer.lastName];
            const sql =  `SELECT * FROM roles`;
            db.query(sql, (err, row) => {
                if (err) {
                    throw err;
                }
            const roles = row.map(({title, id}) => ({name: title, value: id}));
            inquirer.prompt([
                {
                    type: "list",
                    name: "role",
                    message: "Which role would you like to assign this employee to?",
                    choices: roles
                }
            ])
            .then(roleAnswer => {
                const role = roleAnswer.role;
                params.push(role);
                const sql = `SELECT * FROM employees`;
                db.query(sql, (err,rows) => {
                    if (err) {
                        throw err;
                    }
                const managers =rows.map(({first_name, last_name, id}) => ({name: `${first_name} ${last_name}`, value: id}));
                managers.push({name: "No manager", value: null});
                inquirer.prompt([
                    {
                        type: "list",
                        name: "manager",
                        message: "Please assign this employee to a manager!",
                        choices: managers
                    }
                ])
                .then (managerAnswer => {
                    const manager = managerAnswer.manager;
                    params.push(manager);
                    const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id)
                    VALUE (?, ?, ? ?)`;
                    db.query(sql, params, (err) => {
                        if (err) {
                            throw err;
                        }
                    console.log("A new employee has been added!");
                        return openEmployees();
                    });
                });
            }); 
                });
            });
        });
};

// update employee's role function go here

const roleUpdate = () => {
    const sql = `SELECT first_name, last_name, id FROM employees`
    db.query(sql, (err, rows) => {
        if (err) {
            throw err;
        }
    const employees = rows.map(({first_name, last_name, id}) => ({name: `${first_name} ${last_name}`, value: id}));
    inquirer.prompt([
        {
            type: "list",
            name: "employee",
            message: "Please select an employee to update their role",
            choices: employees
        }
    ])
    .then(employeeAnswer => {
        const employee = employeeAnswer.employee;
        const params= [employee];
        const sql = `SELECT title, id FROM roles`;
        db.query(sql, (err, rows) => {
            if (err) {
                throw err;
            }
        const roles = rows.map(({title, id}) =>({name: title, value: id}));
        inquirer.prompt([
            {
                type: "list",
                name: "role",
                message: "Please select a new role for this employee",
                choices: roles
            }
        ])
        .then(roleAnswer => {
            const role = roleAnswer.role;
            params.unshift(role);
            const sql = `UPDATE employees
                        SET role_id = ?
                        WHERE id = ?`
        db.query(sql, params, (err) => {
            if (err) {
                throw err;
            }
            console.log("Employee's role has been updated!");
            return openEmployees();
        });
        });
        });
    });
    });
};

// function update employee's manager go here 

const updateManager =() => {
    const sql = `SELECT first_name, last_name, id FROM employees`
    db.query(sql, (err, rows) => {
        if (err) {
            throw err;
        }
        const employees = rows.map(({first_name, last_name, id}) => ({name: `${first_name} ${last_name}`, value: id}));
        inquirer.prompt([
            {
                type: "list",
                name: "employee",
                messasge: "Please select an employee to update their manager?"
                choices: employees
            }
        ])
        .then(employeeAnswer => {
            const employee =employeeAnswer.employee;
            const params = [employee];
            const sql = `SELECT first_name, last_name, id FROM employees`;
            db.query(sql, (err, rows) => {
                if (err) {
                    throw err;
                }
            const managers = rows.map(({first_name, last_name, id}) => ({name: `${first_name} ${last_name}`, value: id}));
            managers.push({name: "No manager", value: null});
            inquirer.prompt([
                {
                    type: "list",
                    name: "manager",
                    message: "Please assign a new manager to the selected employee",
                    choices: managers
                }
            ])
        .then(managerAnswer => {
            const manager =managerAnswer.manager;
            params.unshift(manager);
            const sql = `UPDATE employees
                        SET manager_id = ?
                        WHERE id = ?`
            db.query(sql, params, (err) => {
                if(err) {
                    throw err;
                }
                console.log("A new manager has been assigned to this employee!");
                return openEmployees();
            });
        });
            });
        });
    });
};




module.exports =appTrigger;