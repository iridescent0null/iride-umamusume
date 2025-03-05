# fixing the FQDN in the test script 
sed -i s/localhost/ec2-57-182-177-197.ap-northeast-1.compute.amazonaws.com/ /home/ubuntu/test/playwright.config.ts
npx playwright test /home/ubuntu/test/tests/test.spec.ts 