USE company_db;
INSERT INTO departments (name)
VALUES
("Management"),
("Sales"),
("Merchandise"),
("HR");

INSERT INTO roles (title, salary, department_id)
VALUES
("District Manager", 200000, 1),
("General Manager", 150000, 1),
("Store Manager", 100000, 2),
("Sales Lead", 80000, 2),
("Stock Lead", 50000, 3),
("Legal Team", 70000, 4),
("Stock associate", 20000, 4);

INSERT INTO employees (first_name, last_name, role_id)
VALUES
("Nick", "Johnson", 1),
("Jira", "Hilton", 2),
("Yuna", "Lee", 3),
("Jessica", "Lu", 4),
("Jonas", "Brien", 5),
("Frank", "Zhang", 6),
("Tiara", "Kim", 7),
("Luke", "Marchant", 5),
("Meagan", "Ang", 4);