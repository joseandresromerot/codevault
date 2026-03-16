/* eslint-disable */
import type { Prisma, Account, Session, VerificationToken, User, Snippet, Tag, SnippetTag, Collection, CollectionItem } from "@prisma/client";
import type { PothosPrismaDatamodel } from "@pothos/plugin-prisma";
export default interface PrismaTypes {
    Account: {
        Name: "Account";
        Shape: Account;
        Include: Prisma.AccountInclude;
        Select: Prisma.AccountSelect;
        OrderBy: Prisma.AccountOrderByWithRelationInput;
        WhereUnique: Prisma.AccountWhereUniqueInput;
        Where: Prisma.AccountWhereInput;
        Create: {};
        Update: {};
        RelationName: "user";
        ListRelations: never;
        Relations: {
            user: {
                Shape: User;
                Name: "User";
                Nullable: false;
            };
        };
    };
    Session: {
        Name: "Session";
        Shape: Session;
        Include: Prisma.SessionInclude;
        Select: Prisma.SessionSelect;
        OrderBy: Prisma.SessionOrderByWithRelationInput;
        WhereUnique: Prisma.SessionWhereUniqueInput;
        Where: Prisma.SessionWhereInput;
        Create: {};
        Update: {};
        RelationName: "user";
        ListRelations: never;
        Relations: {
            user: {
                Shape: User;
                Name: "User";
                Nullable: false;
            };
        };
    };
    VerificationToken: {
        Name: "VerificationToken";
        Shape: VerificationToken;
        Include: never;
        Select: Prisma.VerificationTokenSelect;
        OrderBy: Prisma.VerificationTokenOrderByWithRelationInput;
        WhereUnique: Prisma.VerificationTokenWhereUniqueInput;
        Where: Prisma.VerificationTokenWhereInput;
        Create: {};
        Update: {};
        RelationName: never;
        ListRelations: never;
        Relations: {};
    };
    User: {
        Name: "User";
        Shape: User;
        Include: Prisma.UserInclude;
        Select: Prisma.UserSelect;
        OrderBy: Prisma.UserOrderByWithRelationInput;
        WhereUnique: Prisma.UserWhereUniqueInput;
        Where: Prisma.UserWhereInput;
        Create: {};
        Update: {};
        RelationName: "accounts" | "sessions" | "snippets" | "collections";
        ListRelations: "accounts" | "sessions" | "snippets" | "collections";
        Relations: {
            accounts: {
                Shape: Account[];
                Name: "Account";
                Nullable: false;
            };
            sessions: {
                Shape: Session[];
                Name: "Session";
                Nullable: false;
            };
            snippets: {
                Shape: Snippet[];
                Name: "Snippet";
                Nullable: false;
            };
            collections: {
                Shape: Collection[];
                Name: "Collection";
                Nullable: false;
            };
        };
    };
    Snippet: {
        Name: "Snippet";
        Shape: Snippet;
        Include: Prisma.SnippetInclude;
        Select: Prisma.SnippetSelect;
        OrderBy: Prisma.SnippetOrderByWithRelationInput;
        WhereUnique: Prisma.SnippetWhereUniqueInput;
        Where: Prisma.SnippetWhereInput;
        Create: {};
        Update: {};
        RelationName: "user" | "tags" | "collections";
        ListRelations: "tags" | "collections";
        Relations: {
            user: {
                Shape: User;
                Name: "User";
                Nullable: false;
            };
            tags: {
                Shape: SnippetTag[];
                Name: "SnippetTag";
                Nullable: false;
            };
            collections: {
                Shape: CollectionItem[];
                Name: "CollectionItem";
                Nullable: false;
            };
        };
    };
    Tag: {
        Name: "Tag";
        Shape: Tag;
        Include: Prisma.TagInclude;
        Select: Prisma.TagSelect;
        OrderBy: Prisma.TagOrderByWithRelationInput;
        WhereUnique: Prisma.TagWhereUniqueInput;
        Where: Prisma.TagWhereInput;
        Create: {};
        Update: {};
        RelationName: "snippets";
        ListRelations: "snippets";
        Relations: {
            snippets: {
                Shape: SnippetTag[];
                Name: "SnippetTag";
                Nullable: false;
            };
        };
    };
    SnippetTag: {
        Name: "SnippetTag";
        Shape: SnippetTag;
        Include: Prisma.SnippetTagInclude;
        Select: Prisma.SnippetTagSelect;
        OrderBy: Prisma.SnippetTagOrderByWithRelationInput;
        WhereUnique: Prisma.SnippetTagWhereUniqueInput;
        Where: Prisma.SnippetTagWhereInput;
        Create: {};
        Update: {};
        RelationName: "snippet" | "tag";
        ListRelations: never;
        Relations: {
            snippet: {
                Shape: Snippet;
                Name: "Snippet";
                Nullable: false;
            };
            tag: {
                Shape: Tag;
                Name: "Tag";
                Nullable: false;
            };
        };
    };
    Collection: {
        Name: "Collection";
        Shape: Collection;
        Include: Prisma.CollectionInclude;
        Select: Prisma.CollectionSelect;
        OrderBy: Prisma.CollectionOrderByWithRelationInput;
        WhereUnique: Prisma.CollectionWhereUniqueInput;
        Where: Prisma.CollectionWhereInput;
        Create: {};
        Update: {};
        RelationName: "user" | "snippets";
        ListRelations: "snippets";
        Relations: {
            user: {
                Shape: User;
                Name: "User";
                Nullable: false;
            };
            snippets: {
                Shape: CollectionItem[];
                Name: "CollectionItem";
                Nullable: false;
            };
        };
    };
    CollectionItem: {
        Name: "CollectionItem";
        Shape: CollectionItem;
        Include: Prisma.CollectionItemInclude;
        Select: Prisma.CollectionItemSelect;
        OrderBy: Prisma.CollectionItemOrderByWithRelationInput;
        WhereUnique: Prisma.CollectionItemWhereUniqueInput;
        Where: Prisma.CollectionItemWhereInput;
        Create: {};
        Update: {};
        RelationName: "collection" | "snippet";
        ListRelations: never;
        Relations: {
            collection: {
                Shape: Collection;
                Name: "Collection";
                Nullable: false;
            };
            snippet: {
                Shape: Snippet;
                Name: "Snippet";
                Nullable: false;
            };
        };
    };
}
export function getDatamodel(): PothosPrismaDatamodel;