
# SEC Attendance Portal

This is a webapp where showroom SEC can submit their attendance. They can mark themselves as 'Present' when they are in showroom only, this app uses their locations. There are showrooms in various location & each showroom can have multiple SEC. Admin can download SEC attendance data with statistics (leave days, working days, late fees etc) in Excel file.


## Features

- SEC | Login & Submit Attendance
- SEC | View Attendance
- Admin | View All Attendance
- Admin | View Individual Attendance
- Admin | Edit Employee Attendance
- Admin | Add Employee/SEC
- Admin | Edit Employee/SEC
- Admin | Delete Employee/SEC
- Admin | Search for Attendance Report
- Admin | Generate & Download Attendance Report
- Admin | View Activity Logs


## Screenshots

![App Screenshot](https://github.com/AnupamAkib/SEC-Attendance-Portal-React.js-Node.js/blob/main/InShot_20220728_180708397_AdobeExpress%20(1).gif?raw=true)


## API Reference

#### Mark attendance of employee as 'status' of a particular day

```http
  POST /SEC/mark
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `empID` | `string` | **Required**. employee ID of the employee |
| `status` | `string` | **Required**. Attendance status (Present/Day off/Sick Leave) |
| `day` | `string` | **Required**. day of attendance |
| `month` | `string` | **Required**. month of attendance |
| `year` | `string` | **Required**. year of attendance |
| `time` | `string` | **Required**. time of attendance |

#### Check if the employee have already submitted his/her attendance in a particular day

```http
  POST /SEC/checkAttendance
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `empID`      | `string` | **Required**. Id of the employee |
| `day`      | `string` | **Required**. day of attendance |
| `month`      | `string` | **Required**. month |
| `year`      | `string` | **Required**. year |

#### Get all attendance of a month

```http
  POST /SEC/allAttendance
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `month`      | `string` | **Required**. month of attendance |
| `year`      | `string` | **Required**. year of attendance |



#### SEC Login

```http
  POST /SEC/SEC_login
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `empID`      | `string` | **Required**. Id of the employee/SEC |
| `password`      | `string` | **Required**. Password of the employee/SEC |


#### SEC Change Password

```http
  POST /SEC/change_Password
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `empID`      | `string` | **Required**. Id of the employee/SEC |
| `new_password`      | `string` | **Required**. New password of the employee/SEC |


#### Admin | Add new SEC/Employee

```http
  POST /SEC/addEmployee
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `empName`      | `string` | **Required**. Name of the new employee/SEC |
| `empID`      | `string` | **Required**. Employee ID of the employee/SEC |
| `password`      | `string` | **Required**. Create a password for the employee/SEC |
| `dayOff`      | `string` | **Required**. Day off of the employee |
| `showroom_name`      | `string` | **Required**. Showroom name where the employee/SEC has been assigned |
| `latitude`      | `string` | **Required**. Latitude of the showroom |
| `longitude`      | `string` | **Required**. Longitude of the showroom |
| `range`      | `string` | **Required**. Range of employee and showroom. If within the range, employee can submit 'Present' attendance |


#### Admin | Edit SEC/Employee

```http
  POST /SEC/editEmployee
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `empName`      | `string` | **Required**. Name of the employee/SEC |
| `empID`      | `string` | **Required**. Employee ID of the employee/SEC |
| `password`      | `string` | **Required**. New password a password for the employee/SEC |
| `dayOff`      | `string` | **Required**. New day off of the employee |
| `showroom_name`      | `string` | **Required**. New showroom name |
| `latitude`      | `string` | **Required**. New showroom Latitude |
| `longitude`      | `string` | **Required**. New showroom Longitude |
| `range`      | `string` | **Required**. New range |


#### Admin | Remove already existing SEC or Employee

```http
  POST /SEC/removeEmployee
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `empID`      | `string` | **Required**. Employee ID of the employee/SEC to remove |


#### Admin | Get all SEC or Employee

```http
  POST /SEC/getAllEmployee
```

#### Admin | Edit individual employee attendance of a particular date

```http
  POST /SEC/editAttendanceIndividual
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `empID` | `string` | **Required**. employee ID of the employee |
| `new_status` | `string` | **Required**. New attendance status (Present/Day off/Sick Leave) |
| `day` | `string` | **Required**. day of attendance |
| `month` | `string` | **Required**. month of attendance |
| `year` | `string` | **Required**. year of attendance |


#### Save users activity log

```http
  POST /SEC/add_activity
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `empName` | `string` | **Required**. Name of the employee |
| `empID` | `string` | **Required**. employee ID of the employee |
| `msg` | `string` | **Required**. Activity message |


#### View all users activity

```http
  POST /SEC/view_activity
```





## 🛠 Skills
Javascript, React.js, Node.js, Express.js, MongoDB, Material UI, HTML, CSS, Bootstrap


## Authors

- [@AnupamAkib](https://github.com/AnupamAkib)

