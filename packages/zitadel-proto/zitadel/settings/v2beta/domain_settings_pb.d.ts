// @generated by protoc-gen-es v1.9.0
// @generated from file zitadel/settings/v2beta/domain_settings.proto (package zitadel.settings.v2beta, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import type {
  BinaryReadOptions,
  FieldList,
  JsonReadOptions,
  JsonValue,
  PartialMessage,
  PlainMessage,
} from "@bufbuild/protobuf";
import { Message, proto3 } from "@bufbuild/protobuf";
import type { ResourceOwnerType } from "./settings_pb.js";

/**
 * @generated from message zitadel.settings.v2beta.DomainSettings
 */
export declare class DomainSettings extends Message<DomainSettings> {
  /**
   * @generated from field: bool login_name_includes_domain = 1;
   */
  loginNameIncludesDomain: boolean;

  /**
   * @generated from field: bool require_org_domain_verification = 2;
   */
  requireOrgDomainVerification: boolean;

  /**
   * @generated from field: bool smtp_sender_address_matches_instance_domain = 3;
   */
  smtpSenderAddressMatchesInstanceDomain: boolean;

  /**
   * resource_owner_type returns if the setting is managed on the organization or on the instance
   *
   * @generated from field: zitadel.settings.v2beta.ResourceOwnerType resource_owner_type = 6;
   */
  resourceOwnerType: ResourceOwnerType;

  constructor(data?: PartialMessage<DomainSettings>);

  static readonly runtime: typeof proto3;
  static readonly typeName = "zitadel.settings.v2beta.DomainSettings";
  static readonly fields: FieldList;

  static fromBinary(
    bytes: Uint8Array,
    options?: Partial<BinaryReadOptions>,
  ): DomainSettings;

  static fromJson(
    jsonValue: JsonValue,
    options?: Partial<JsonReadOptions>,
  ): DomainSettings;

  static fromJsonString(
    jsonString: string,
    options?: Partial<JsonReadOptions>,
  ): DomainSettings;

  static equals(
    a: DomainSettings | PlainMessage<DomainSettings> | undefined,
    b: DomainSettings | PlainMessage<DomainSettings> | undefined,
  ): boolean;
}
