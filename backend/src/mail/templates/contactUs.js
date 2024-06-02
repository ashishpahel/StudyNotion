exports.contactDetailsTemplate = (firstName, lastName, email, phoneNo, message) => {
    return `<!DOCTYPE html>
	<html>
	
	<head>
		<meta charset="UTF-8">
		<title>Contact Details Email</title>
		<style>
			body {
				background-color: #f4f4f4;
				font-family: 'Helvetica Neue', Arial, sans-serif;
				font-size: 16px;
				line-height: 1.6;
				color: #333333;
				margin: 0;
				padding: 0;
			}
	
			.container {
				max-width: 600px;
				margin: 30px auto;
				padding: 20px;
				background-color: #ffffff;
				border-radius: 8px;
				box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
			}
	
			.logo {
				max-width: 150px;
				margin: 0 auto 20px;
				display: block;
			}
	
			.header {
				font-size: 24px;
				font-weight: bold;
				margin-bottom: 20px;
				text-align: center;
				color: #333333;
			}
	
			.table {
				width: 100%;
				border-collapse: collapse;
				margin-bottom: 20px;
			}
	
			.table th, .table td {
				border: 1px solid #dddddd;
				text-align: left;
				padding: 12px;
			}
	
			.table th {
				background-color: #f9f9f9;
				font-weight: bold;
			}
	
			.table tr:nth-child(even) {
				background-color: #f9f9f9;
			}
		</style>
	</head>
	
	<body>
		<div class="container">
			<img class="logo" src="https://i.ibb.co/7Xyj3PC/logo.png" alt="StudyNotion Logo">
			<div class="header">Contact Details</div>
			<table class="table">
				<tr>
					<th>First Name</th>
					<td>${firstName}</td>
				</tr>
				<tr>
					<th>Last Name</th>
					<td>${lastName}</td>
				</tr>
				<tr>
					<th>Email</th>
					<td>${email}</td>
				</tr>
				<tr>
					<th>Phone No</th>
					<td>${phoneNo}</td>
				</tr>
				<tr>
					<th>Message</th>
					<td>${message}</td>
				</tr>
			</table>
		</div>
	</body>
	
	</html>`;
};
