import { Vpc } from "@aws-cdk/aws-ec2"
import { XorApp, XorStack } from "./constructs"

export default class BaseStack extends XorStack {
  constructor (app: XorApp, id: string) {
    super(app, id)

    new Vpc(this, 'Vpc', {
      maxAzs: 2,
      natGateways: 0,
    })
  }
}
