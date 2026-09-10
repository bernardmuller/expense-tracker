# MCP Server

The Expenny MCP server is a Go binary that is hosted on AWS lambdas.

## Setup
- Create an AWS lambda, running on ARM64 architecture on AWS's 2023 Linux runtime
- Add the AWS Lambda web Adapter to the function's Layers section to support the MCP long running nature
- Increase the Function's timeout time to 30s
- On the development machine, build the mcp server using the built command in the Makefile
- Zip the built binary in the dist folder
- Upload the zip file to the function's code block using the console or the AWS CLI
- Create a new API Gateway called "expenny-mcp-api"
- Add POST /mcp as a route
- Add an integration to the route pointing at the Lambda function, any policies will automatically be created
- Add the API Gateway URL to a CNAME record in Cloudflare
