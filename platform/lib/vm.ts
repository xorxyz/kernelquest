import {
    Instance,
    InstanceClass,
    InstanceSize,
    InstanceType,
    ISecurityGroup,
    IVpc,
    SubnetType,
    UserData,
  } from '@aws-cdk/aws-ec2';
  import { IRole } from '@aws-cdk/aws-iam';
  import { Tags } from '@aws-cdk/core';
import { XorStack } from './constructs';
import { OpenBSD68 } from './os';
import { now } from './utils';
  
  interface IProps {
    uniqueId: string,
    vpc: IVpc,
    securityGroup: ISecurityGroup,
    role: IRole,
  }
  
  export default function createVM(stack: XorStack, props: IProps) {
    const instanceTypes: Record<string, InstanceType> = {
      qa: InstanceType.of(InstanceClass.T2, InstanceSize.MICRO),
      staging: InstanceType.of(InstanceClass.T2, InstanceSize.XLARGE),
      prod: InstanceType.of(InstanceClass.T2, InstanceSize.XLARGE),
    };
  
    const name = `Wf2Instance-${props.uniqueId}`;
    const vm = new Instance(stack, name, {
      instanceName: name,
      instanceType: instanceTypes[stack.env],
      machineImage: OpenBSD68,
      role: props.role,
      vpc: props.vpc,
      vpcSubnets: {
        subnetType: SubnetType.PUBLIC,
        onePerAz: true,
      },
      securityGroup: props.securityGroup,
      userData: UserData.forLinux({ shebang: '#!/bin/bash -xe' }),
    });
  
    Tags.of(stack).add('LastModified', now(), {
      includeResourceTypes: ['AWS::EC2::Instance'],
    });
  
    return vm;
  }
  