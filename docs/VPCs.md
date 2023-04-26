# Understanding AWS VPCs

- **VPC:** Virtual private cloud
- A VPC has one subnet in each AZ
- An internet gateway allows communication between VPC and internet.

## Public v. Private Subnet

The key difference is the route for 0.0.0.0/0 is handled in the associated route table.

- **Private subnet** sets that route to a NAT gateway instance.
  - internet traffic is routed through NAT in the public subnet
- **Public subnet** routes 0.0.0.0/0 through an Internet Gateway (igw).
  - Instances in a public subnet require public IPs to talk to the Internet.

## Lambda Functions in a Public Subnet

https://stackoverflow.com/questions/52992085/why-cant-an-aws-lambda-function-inside-a-public-subnet-in-a-vpc-connect-to-the

The top answer is super helpful ^.
