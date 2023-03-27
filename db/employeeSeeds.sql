USE company;

INSERT INTO departments (name)
VALUES
("Management"),
("Sales"),
("Merchandise"),
("HR");

INSERT INTO roles (title, salary, department_id)
VALUES
("Store Manager", 100000, 1),
("Sales Lead", 80000, 2),
("Stock Lead", 50000, 3),
("Legal Team", 70000, 4);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
("Nick", "Johnson", 1),
("Jira", "Hilton", 2),
("Yuna", "Lee", 3),
("Jessica", "Lu", 4)
("Jonas", "Brien", 2)
("Frank", "Zhang", 4);