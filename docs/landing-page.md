# Landing page

The landing page is a basic, single html page with companion assets that are uploaded to an S3 bucket in AWS, hosted behind CloudFront and Cloudflare.

## Steps taken

### S3
- Created a new S3 Bucket in AWS, called expenny-public-bucket
- Ensure all public access to the bucket is blocked
- Upload the html file and the assets to the bucket
- Set origin path to "/" (not a filename)

### CloudFront
- Create a new disto
- Point the distro's origin to S3, this should automatically create policies for the distro to have access to the bucket's con
- Once created, added 404 and 403 as error pages that points to the not-found.html file I have to vibe code quickly to not get an ugly "Access Denied" response in the browser
- Add expenny.co.za & www.expenny.co.za to the alternate domains
- Request an SSL certificate from AWS after adding the provided CNAME records to expenny.co.za in Cloudflare
- Waited for the green tick

### CloudFlare
- Removed old misconfigured Apex domain records that made CloudFront clash with the CNAME flattening
- ADDED the expenny.co.za and www.expenny.co.za CNAMEs to point to the CloudFront url
