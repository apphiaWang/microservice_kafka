CREATE DATABASE DEMO;
USE DEMO;
CREATE TABLE customers (  id MEDIUMINT NOT NULL AUTO_INCREMENT, name VARCHAR(50), credit INT(20), primary key(id));

CREATE USER 'customer_user' IDENTIFIED WITH mysql_native_password BY 'password';
grant all privileges on DEMO.customers to  'customer_user' with grant option;

CREATE TABLE orders (  id MEDIUMINT NOT NULL AUTO_INCREMENT, customerId MEDIUMINT, amount INT(20), status varchar(20), primary key(id));
CREATE USER 'order_user' IDENTIFIED WITH mysql_native_password BY 'password';
grant all privileges on DEMO.orders to  'order_user' with grant option;