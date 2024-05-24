// @generated by protoc-gen-es v1.9.0
// @generated from file zitadel/user/schema/v3alpha/user_schema.proto (package zitadel.user.schema.v3alpha, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import type {
  BinaryReadOptions,
  FieldList,
  JsonReadOptions,
  JsonValue,
  PartialMessage,
  PlainMessage,
  Struct,
} from "@bufbuild/protobuf";
import { Message, proto3 } from "@bufbuild/protobuf";
import type {
  Details,
  TextQueryMethod,
} from "../../../object/v2beta/object_pb.js";

/**
 * @generated from enum zitadel.user.schema.v3alpha.FieldName
 */
export declare enum FieldName {
  /**
   * @generated from enum value: FIELD_NAME_UNSPECIFIED = 0;
   */
  UNSPECIFIED = 0,

  /**
   * @generated from enum value: FIELD_NAME_TYPE = 1;
   */
  TYPE = 1,

  /**
   * @generated from enum value: FIELD_NAME_STATE = 2;
   */
  STATE = 2,

  /**
   * @generated from enum value: FIELD_NAME_REVISION = 3;
   */
  REVISION = 3,

  /**
   * @generated from enum value: FIELD_NAME_CHANGE_DATE = 4;
   */
  CHANGE_DATE = 4,
}

/**
 * @generated from enum zitadel.user.schema.v3alpha.State
 */
export declare enum State {
  /**
   * @generated from enum value: STATE_UNSPECIFIED = 0;
   */
  UNSPECIFIED = 0,

  /**
   * @generated from enum value: STATE_ACTIVE = 1;
   */
  ACTIVE = 1,

  /**
   * @generated from enum value: STATE_INACTIVE = 2;
   */
  INACTIVE = 2,
}

/**
 * @generated from enum zitadel.user.schema.v3alpha.AuthenticatorType
 */
export declare enum AuthenticatorType {
  /**
   * @generated from enum value: AUTHENTICATOR_TYPE_UNSPECIFIED = 0;
   */
  UNSPECIFIED = 0,

  /**
   * @generated from enum value: AUTHENTICATOR_TYPE_USERNAME = 1;
   */
  USERNAME = 1,

  /**
   * @generated from enum value: AUTHENTICATOR_TYPE_PASSWORD = 2;
   */
  PASSWORD = 2,

  /**
   * @generated from enum value: AUTHENTICATOR_TYPE_WEBAUTHN = 3;
   */
  WEBAUTHN = 3,

  /**
   * @generated from enum value: AUTHENTICATOR_TYPE_TOTP = 4;
   */
  TOTP = 4,

  /**
   * @generated from enum value: AUTHENTICATOR_TYPE_OTP_EMAIL = 5;
   */
  OTP_EMAIL = 5,

  /**
   * @generated from enum value: AUTHENTICATOR_TYPE_OTP_SMS = 6;
   */
  OTP_SMS = 6,

  /**
   * @generated from enum value: AUTHENTICATOR_TYPE_AUTHENTICATION_KEY = 7;
   */
  AUTHENTICATION_KEY = 7,

  /**
   * @generated from enum value: AUTHENTICATOR_TYPE_IDENTITY_PROVIDER = 8;
   */
  IDENTITY_PROVIDER = 8,
}

/**
 * @generated from message zitadel.user.schema.v3alpha.UserSchema
 */
export declare class UserSchema extends Message<UserSchema> {
  /**
   * ID is the read-only unique identifier of the schema.
   *
   * @generated from field: string id = 1;
   */
  id: string;

  /**
   * Details provide some base information (such as the last change date) of the schema.
   *
   * @generated from field: zitadel.object.v2beta.Details details = 2;
   */
  details?: Details;

  /**
   * Type is a human readable text describing the schema.
   *
   * @generated from field: string type = 3;
   */
  type: string;

  /**
   * Current state of the schema.
   *
   * @generated from field: zitadel.user.schema.v3alpha.State state = 4;
   */
  state: State;

  /**
   * Revision is a read only version of the schema, each update of the `schema`-field increases the revision.
   *
   * @generated from field: uint32 revision = 5;
   */
  revision: number;

  /**
   * JSON schema representation defining the user.
   *
   * @generated from field: google.protobuf.Struct schema = 6;
   */
  schema?: Struct;

  /**
   * Defines the possible types of authenticators.
   * This allows creating different user types like human/machine without usage of actions to validate possible authenticators.
   * Removal of an authenticator does not remove the authenticator on a user.
   *
   * @generated from field: repeated zitadel.user.schema.v3alpha.AuthenticatorType possible_authenticators = 7;
   */
  possibleAuthenticators: AuthenticatorType[];

  constructor(data?: PartialMessage<UserSchema>);

  static readonly runtime: typeof proto3;
  static readonly typeName = "zitadel.user.schema.v3alpha.UserSchema";
  static readonly fields: FieldList;

  static fromBinary(
    bytes: Uint8Array,
    options?: Partial<BinaryReadOptions>,
  ): UserSchema;

  static fromJson(
    jsonValue: JsonValue,
    options?: Partial<JsonReadOptions>,
  ): UserSchema;

  static fromJsonString(
    jsonString: string,
    options?: Partial<JsonReadOptions>,
  ): UserSchema;

  static equals(
    a: UserSchema | PlainMessage<UserSchema> | undefined,
    b: UserSchema | PlainMessage<UserSchema> | undefined,
  ): boolean;
}

/**
 * @generated from message zitadel.user.schema.v3alpha.SearchQuery
 */
export declare class SearchQuery extends Message<SearchQuery> {
  /**
   * @generated from oneof zitadel.user.schema.v3alpha.SearchQuery.query
   */
  query:
    | {
        /**
         * Union the results of each sub query ('OR').
         *
         * @generated from field: zitadel.user.schema.v3alpha.OrQuery or_query = 1;
         */
        value: OrQuery;
        case: "orQuery";
      }
    | {
        /**
         * Limit the result to match all sub queries ('AND').
         * Note that if you specify multiple queries, they will be implicitly used as andQueries.
         * Use the andQuery in combination with orQuery and notQuery.
         *
         * @generated from field: zitadel.user.schema.v3alpha.AndQuery and_query = 2;
         */
        value: AndQuery;
        case: "andQuery";
      }
    | {
        /**
         * Exclude / Negate the result of the sub query ('NOT').
         *
         * @generated from field: zitadel.user.schema.v3alpha.NotQuery not_query = 3;
         */
        value: NotQuery;
        case: "notQuery";
      }
    | {
        /**
         * Limit the result to a specific schema type.
         *
         * @generated from field: zitadel.user.schema.v3alpha.TypeQuery type_query = 5;
         */
        value: TypeQuery;
        case: "typeQuery";
      }
    | {
        /**
         * Limit the result to a specific state of the schema.
         *
         * @generated from field: zitadel.user.schema.v3alpha.StateQuery state_query = 6;
         */
        value: StateQuery;
        case: "stateQuery";
      }
    | {
        /**
         * Limit the result to a specific schema ID.
         *
         * @generated from field: zitadel.user.schema.v3alpha.IDQuery id_query = 7;
         */
        value: IDQuery;
        case: "idQuery";
      }
    | { case: undefined; value?: undefined };

  constructor(data?: PartialMessage<SearchQuery>);

  static readonly runtime: typeof proto3;
  static readonly typeName = "zitadel.user.schema.v3alpha.SearchQuery";
  static readonly fields: FieldList;

  static fromBinary(
    bytes: Uint8Array,
    options?: Partial<BinaryReadOptions>,
  ): SearchQuery;

  static fromJson(
    jsonValue: JsonValue,
    options?: Partial<JsonReadOptions>,
  ): SearchQuery;

  static fromJsonString(
    jsonString: string,
    options?: Partial<JsonReadOptions>,
  ): SearchQuery;

  static equals(
    a: SearchQuery | PlainMessage<SearchQuery> | undefined,
    b: SearchQuery | PlainMessage<SearchQuery> | undefined,
  ): boolean;
}

/**
 * @generated from message zitadel.user.schema.v3alpha.OrQuery
 */
export declare class OrQuery extends Message<OrQuery> {
  /**
   * @generated from field: repeated zitadel.user.schema.v3alpha.SearchQuery queries = 1;
   */
  queries: SearchQuery[];

  constructor(data?: PartialMessage<OrQuery>);

  static readonly runtime: typeof proto3;
  static readonly typeName = "zitadel.user.schema.v3alpha.OrQuery";
  static readonly fields: FieldList;

  static fromBinary(
    bytes: Uint8Array,
    options?: Partial<BinaryReadOptions>,
  ): OrQuery;

  static fromJson(
    jsonValue: JsonValue,
    options?: Partial<JsonReadOptions>,
  ): OrQuery;

  static fromJsonString(
    jsonString: string,
    options?: Partial<JsonReadOptions>,
  ): OrQuery;

  static equals(
    a: OrQuery | PlainMessage<OrQuery> | undefined,
    b: OrQuery | PlainMessage<OrQuery> | undefined,
  ): boolean;
}

/**
 * @generated from message zitadel.user.schema.v3alpha.AndQuery
 */
export declare class AndQuery extends Message<AndQuery> {
  /**
   * @generated from field: repeated zitadel.user.schema.v3alpha.SearchQuery queries = 1;
   */
  queries: SearchQuery[];

  constructor(data?: PartialMessage<AndQuery>);

  static readonly runtime: typeof proto3;
  static readonly typeName = "zitadel.user.schema.v3alpha.AndQuery";
  static readonly fields: FieldList;

  static fromBinary(
    bytes: Uint8Array,
    options?: Partial<BinaryReadOptions>,
  ): AndQuery;

  static fromJson(
    jsonValue: JsonValue,
    options?: Partial<JsonReadOptions>,
  ): AndQuery;

  static fromJsonString(
    jsonString: string,
    options?: Partial<JsonReadOptions>,
  ): AndQuery;

  static equals(
    a: AndQuery | PlainMessage<AndQuery> | undefined,
    b: AndQuery | PlainMessage<AndQuery> | undefined,
  ): boolean;
}

/**
 * @generated from message zitadel.user.schema.v3alpha.NotQuery
 */
export declare class NotQuery extends Message<NotQuery> {
  /**
   * @generated from field: zitadel.user.schema.v3alpha.SearchQuery query = 1;
   */
  query?: SearchQuery;

  constructor(data?: PartialMessage<NotQuery>);

  static readonly runtime: typeof proto3;
  static readonly typeName = "zitadel.user.schema.v3alpha.NotQuery";
  static readonly fields: FieldList;

  static fromBinary(
    bytes: Uint8Array,
    options?: Partial<BinaryReadOptions>,
  ): NotQuery;

  static fromJson(
    jsonValue: JsonValue,
    options?: Partial<JsonReadOptions>,
  ): NotQuery;

  static fromJsonString(
    jsonString: string,
    options?: Partial<JsonReadOptions>,
  ): NotQuery;

  static equals(
    a: NotQuery | PlainMessage<NotQuery> | undefined,
    b: NotQuery | PlainMessage<NotQuery> | undefined,
  ): boolean;
}

/**
 * @generated from message zitadel.user.schema.v3alpha.IDQuery
 */
export declare class IDQuery extends Message<IDQuery> {
  /**
   * Defines the ID of the user schema to query for.
   *
   * @generated from field: string id = 1;
   */
  id: string;

  /**
   * Defines which text comparison method used for the id query.
   *
   * @generated from field: zitadel.object.v2beta.TextQueryMethod method = 2;
   */
  method: TextQueryMethod;

  constructor(data?: PartialMessage<IDQuery>);

  static readonly runtime: typeof proto3;
  static readonly typeName = "zitadel.user.schema.v3alpha.IDQuery";
  static readonly fields: FieldList;

  static fromBinary(
    bytes: Uint8Array,
    options?: Partial<BinaryReadOptions>,
  ): IDQuery;

  static fromJson(
    jsonValue: JsonValue,
    options?: Partial<JsonReadOptions>,
  ): IDQuery;

  static fromJsonString(
    jsonString: string,
    options?: Partial<JsonReadOptions>,
  ): IDQuery;

  static equals(
    a: IDQuery | PlainMessage<IDQuery> | undefined,
    b: IDQuery | PlainMessage<IDQuery> | undefined,
  ): boolean;
}

/**
 * @generated from message zitadel.user.schema.v3alpha.TypeQuery
 */
export declare class TypeQuery extends Message<TypeQuery> {
  /**
   * Defines which type to query for.
   *
   * @generated from field: string type = 1;
   */
  type: string;

  /**
   * Defines which text comparison method used for the type query.
   *
   * @generated from field: zitadel.object.v2beta.TextQueryMethod method = 2;
   */
  method: TextQueryMethod;

  constructor(data?: PartialMessage<TypeQuery>);

  static readonly runtime: typeof proto3;
  static readonly typeName = "zitadel.user.schema.v3alpha.TypeQuery";
  static readonly fields: FieldList;

  static fromBinary(
    bytes: Uint8Array,
    options?: Partial<BinaryReadOptions>,
  ): TypeQuery;

  static fromJson(
    jsonValue: JsonValue,
    options?: Partial<JsonReadOptions>,
  ): TypeQuery;

  static fromJsonString(
    jsonString: string,
    options?: Partial<JsonReadOptions>,
  ): TypeQuery;

  static equals(
    a: TypeQuery | PlainMessage<TypeQuery> | undefined,
    b: TypeQuery | PlainMessage<TypeQuery> | undefined,
  ): boolean;
}

/**
 * @generated from message zitadel.user.schema.v3alpha.StateQuery
 */
export declare class StateQuery extends Message<StateQuery> {
  /**
   * Defines the state to query for.
   *
   * @generated from field: zitadel.user.schema.v3alpha.State state = 1;
   */
  state: State;

  constructor(data?: PartialMessage<StateQuery>);

  static readonly runtime: typeof proto3;
  static readonly typeName = "zitadel.user.schema.v3alpha.StateQuery";
  static readonly fields: FieldList;

  static fromBinary(
    bytes: Uint8Array,
    options?: Partial<BinaryReadOptions>,
  ): StateQuery;

  static fromJson(
    jsonValue: JsonValue,
    options?: Partial<JsonReadOptions>,
  ): StateQuery;

  static fromJsonString(
    jsonString: string,
    options?: Partial<JsonReadOptions>,
  ): StateQuery;

  static equals(
    a: StateQuery | PlainMessage<StateQuery> | undefined,
    b: StateQuery | PlainMessage<StateQuery> | undefined,
  ): boolean;
}
