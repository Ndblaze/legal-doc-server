# Deploying a Node.js Backend to an EC2 Instance

This guide explains how to set up an AWS EC2 instance and deploy a Node.js backend application.

---

## Prerequisites

1. **AWS Account**  
   Create an account at [aws.amazon.com](https://aws.amazon.com).

2. **Node.js Installed Locally**  
   Ensure Node.js and npm are installed on your local machine.  
   Check versions:
   ```bash
   node -v
   npm -v

# Steps to Deploy Node.js Backend to EC2

## 1. Launch an EC2 Instance

### Log in to AWS Management Console
1. Open the [AWS Management Console](https://aws.amazon.com/console/).
2. Navigate to the **EC2 Dashboard**.

### Create an EC2 Instance
1. Click **Launch Instance**.
2. **Choose an AMI**:
   - Select **Amazon Linux 2** or **Ubuntu** as your AMI (in our case we used Ubuntu).
3. **Select Instance Type**:
   - Choose an instance type (e.g., `t2.micro` for free tier eligibility).

### Configure Key Pair
1. Create a new key pair or select an existing one.
2. Download the key pair and keep it safe, as it will be needed to SSH into the instance.

### Configure Security Group
1. Allow inbound traffic on the following ports:
   - **22**: For SSH access.
   - **80**: For HTTP access.
   - **443**: For HTTPS access.
   - **3000**: For your Node.js app (or the port your app will use).
2. Add rules for each required port.

### Launch the Instance
1. Review your configuration.
2. Click **Launch Instance** to start your EC2 instance.

---

# Configure Security Group for Your Node.js App

## 5. Configure Security Group

### Open Your EC2 Instance Security Group
1. Navigate to the [AWS EC2 Dashboard](https://aws.amazon.com/ec2/).
2. In the left-hand menu, click on **Security Groups** under **Network & Security**.
3. Locate the security group associated with your EC2 instance.

---

### Allow Incoming Traffic
1. Select your security group and go to the **Inbound rules** tab.
2. Click **Edit inbound rules**.
3. Add a new rule:
   - **Type**: Custom TCP
   - **Port Range**: Enter the port your app is running on (e.g., `3000`).
   - **Source**: 
     - Choose **Anywhere** to allow access from all IPs (for testing/development purposes).
     - Or choose **My IP** to restrict access to your current IP address.
4. Save the changes by clicking **Save rules**.

---

Your security group is now configured to allow traffic to your Node.js app.


---

## 2. Connect to the EC2 Instance Using EC2 Instance Connect

1. **Navigate to EC2 Dashboard**  
   In the AWS Management Console, go to the **EC2 Dashboard**.

2. **Select Your Instance**  
   - Find your instance in the list of running instances.
   - Click on the **Instance ID** to open the instance details page.

3. **Click the Connect Button**  
   - On the instance details page, click **Connect** (top right corner).

4. **Select EC2 Instance Connect**  
   - In the **Connect to instance** window, select the **EC2 Instance Connect** tab.

5. **Connect to the Instance**  
   - Click **Connect** to open a terminal session directly in your browser.

---

# Set Up the Environment on EC2

Once you have launched and connected to your EC2 instance, follow these steps to set up the environment for your Node.js backend.

---

## 2. Set Up the Environment

### Update Packages
1. Run the following command to update and upgrade all packages:
  ```bash
  sudo apt update && sudo apt upgrade -y
  ```

2. ### Install Node.js and npm
Install the latest version of Node.js:
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

3. ### Verify Installation
Check that Node.js and npm are installed
```bash
node -v
npm -v
```

4. ### Install Git
since my project is on GitHub, i install Git:
```bash
sudo apt install git -y
```

# Upload Your Node.js App

1. ### Clone Your Project
If your project is on GitHub:
```bash
git clone https://github.com/your-repo-name.git
cd your-repo-name
```

2. ### Install Dependancies
If your project is on GitHub:
```bash
npm install
```

# Configure and Run the App

1. ### Start The App
Start the Node.js application
```bash
node server.js
```
(Note: Replace server.js with your app's entry point.)

2. ### Run the App in the Background
Install pm2 to manage your app:
```bash
Install pm2 to manage your app:
pm2 start server.js --name node-backend
pm2 save
pm2 startup
```

# Test Your Node.js App on EC2

## 6. Test Your App

### Get Your Public IP
1. Go to the [AWS EC2 Dashboard](https://aws.amazon.com/ec2/).
2. Locate your running EC2 instance.
3. Copy the **Public IPv4 Address** of your instance from the instance details.

---

### Access Your App
1. Open your web browser.
2. Navigate to the following URL: http://your-ec2-public-ip:3000

   Replace `your-ec2-public-ip` with the Public IPv4 Address of your EC2 instance.

3. If everything is set up correctly, your Node.js app should be accessible from this URL.

---

Your Node.js app is now live and accessible via your EC2 instance's public IP address. 🚀

# Troubleshooting Common issues

## 1. Cannot Connect to EC2
- **Issue**: You are unable to access your app or connect to your EC2 instance.
- **Solution**:
  1. Verify that your **Security Group** allows inbound traffic on the required port (e.g., `3000`).
     - Go to the EC2 **Security Groups** settings and check the **Inbound Rules**.
  2. Ensure that the **Public IPv4 Address** is correct and matches your instance's address.
  3. Confirm that your internet connection is stable.

---

## 2. App Not Running
- **Issue**: Your app is not running, or the server appears down.
- **Solution**:
  1. **Check the App Logs**:
     - Use **pm2** to view the application logs:
       ```bash
       pm2 logs
       ```
  2. **Restart the App**:
     - If the app has stopped, restart it with:
       ```bash
       pm2 restart app-name
       ```
     Replace `app-name` with the name of your application.

  3. **Verify Node.js and Dependencies**:
     - Ensure that all required dependencies are installed:
       ```bash
       npm install
       ```

  4. **Check Port Usage**:
     - Ensure the application is running on the correct port (e.g., `3000`) and no other service is using it.

---

## 3. Public IP Not Loading the App
- **Issue**: Accessing the public IP in the browser does not show the app.
- **Solution**:
  1. Confirm that the app is running in the background with:
     ```bash
     pm2 list
     ```
  2. Ensure the **port number** in the browser matches the one configured in your Node.js app (e.g., `http://your-ec2-public-ip:3000`).





