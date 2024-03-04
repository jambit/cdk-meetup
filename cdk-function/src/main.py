import os
import datetime
import awswrangler as wr
from pandas import DataFrame
from pathlib import Path
from scrapy import Spider, Request


class SPSpider(Spider):
    name = 'cdk-function'

    def start_requests(self):
        urls = [
            "https://mall.industry.siemens.com/goos/WelcomePage.aspx?regionUrl=/de&language=de",
        ]
        for url in urls:
            yield (Request(url=url, callback=self.parse))

    def parse(self, response):
        page = response.url.split("/")[-2]
        filename = f"quotes-{page}.html"
        Path(filename).write_bytes(response.body)
        self.log(f"Saved file {filename}")


def lambda_handler(event, context):
    print('Start crawling...')

    # process = CrawlerProcess(settings={
    # })
    # process.crawl(SPSpider)
    # process.start()

    bucket = os.environ['BUCKET']
    print(f'Upload to Bucket: {bucket}')

    df = DataFrame({
        "id": [1, 2, 3],
        "price": [230, 560, 120]
    })

    wr.s3.to_csv(df, path=f"s3://{bucket}/{datetime.date.today()}-prices.csv")

    return {
        "statusCode": 200,
    }


if __name__ == "__main__":
    lambda_handler({}, {})
