import "@typespec/http";
import "@typespec/openapi";
import "@typespec/openapi3";

using Http;
using OpenAPI;

/**
 * Create beautiful product and API documentation with our developer friendly platform.
 */
@service({
  title: "ReadMe API 🦉",
})
@info({
  version: "4.355.0",
  contact: {
    name: "API Support",
    url: "https://docs.readme.com/main/docs/need-more-support",
    email: "support@readme.io",
  },
})
namespace ReadMeAPI;

model baseError {
  /**
   * An error code unique to the error received.
   */
  error?: string;

  /**
   * The reason why the error occured.
   */
  message?: string;

  /**
   * A helpful suggestion for how to alleviate the error.
   */
  suggestion?: string;

  /**
   * A [ReadMe Metrics](https://readme.com/metrics/) log URL where you can see more information the request that you made. If we have metrics URLs unavailable for your request, this URL will be a URL to our API Reference.
   */
  @format("url") docs?: string;

  /**
   * Information on where you can receive additional assistance from our wonderful support team.
   */
  help?: string;

  /**
   * A short poem we wrote you about your error.
   */
  poem?: string[];
}

model apply {
  /**
   * Your full name
   */
  @minLength(1) name: string = "Your Name";

  /**
   * A valid email we can reach you at.
   */
  email: string = "you@example.com";

  /**
   * The job you're looking to apply for (https://readme.com/careers).
   */
  job:
    | "Front End Engineer"
    | "Full Stack Engineer"
    | "Head of Product"
    | "Head of Solutions Engineering"
    | "Product Designer" = "Front End Engineer";

  /**
   * Learn more at https://lgbtlifecenter.org/pronouns/
   */
  pronouns?: string;

  /**
   * What have you been up to the past few years?
   */
  @format("url") linkedin?: string;

  /**
   * Or Bitbucket, Gitlab or anywhere else your code is hosted!
   */
  @format("url") github?: string;

  /**
   * What should we know about you?
   */
  @format("blob") coverLetter?: string;

  /**
   * Want to play with the API but not actually apply? Set this to true.
   */
  dontReallyApply?: boolean;
}

model category {
  /**
   * A short title for the category. This is what will show in the sidebar.
   */
  title?: string;

  /**
   * A category can be part of your reference or guide documentation, which is determined by this field.
   */
  type?: "reference" | "guide" = "guide";
}

model changelog {
  /**
   * Title of the changelog.
   */
  title: string;

  type?: "" | "added" | "fixed" | "improved" | "deprecated" | "removed";

  /**
   * Body content of the changelog.
   */
  body: string;

  /**
   * Visibility of the changelog.
   */
  hidden?: boolean = true;
}

model condensedProjectData {
  name?: string;
  subdomain?: string;
  jwtSecret?: string;

  /**
   * The base URL for the project. If the project is not running under a custom domain, it will be `https://projectSubdomain.readme.io`, otherwise it can either be or `https://example.com` or, in the case of an enterprise child project `https://example.com/projectSubdomain`.
   */
  @format("url") baseUrl?: string;

  plan?: string;
}

model customPage {
  /**
   * Title of the custom page.
   */
  title: string;

  /**
   * Body formatted in Markdown (displayed by default).
   */
  body?: string;

  /**
   * Body formatted in HTML (sanitized, only displayed if `htmlmode` is **true**).
   */
  html?: string;

  /**
   * **true** if `html` should be displayed, **false** if `body` should be displayed.
   */
  htmlmode?: boolean;

  /**
   * Visibility of the custom page.
   */
  hidden?: boolean = true;
}

@oneOf
union docSchemaPost {
  unknown,
  unknown,
}

model docSchemaPut {
  /**
   * Title of the page.
   */
  title?: string;

  /**
   * Type of the page. The available types all show up under the /docs/ URL path of your docs project (also known as the "guides" section). Can be "basic" (most common), "error" (page desribing an API error), or "link" (page that redirects to an external link).
   */
  type?: "basic" | "error" | "link";

  /**
   * Body content of the page, formatted in [ReadMe-flavored Markdown](https://docs.readme.com/rdmd/docs).
   */
  body?: string;

  /**
   * Category ID of the page, which you can get through [the **Get all categories** endpoint](https://docs.readme.com/main/reference/getcategories).
   */
  category?: string;

  /**
   * Visibility of the page.
   */
  hidden?: boolean;

  /**
   * The position of the page in your project sidebar.
   */
  order?: integer;

  /**
   * The parent doc's ID, if the page is a subpage.
   */
  parentDoc?: string;

  error?: {
    code?: string;
  };

  /**
   * The slug of the category this page is associated with. You can get this through [the **Get all categories** endpoint](https://docs.readme.com/main/reference/getcategories). This field is an alternative to the `category` field.
   */
  categorySlug?: string;

  /**
   * If this page is a subpage, this field will be the slug of the parent document. You can get this through https://docs.readme.com/main/reference/docs#getdoc. This field is an alternative to the `parentDoc` field.
   */
  parentDocSlug?: string;
}

model docSchemaResponse {
  /**
   * Title of the page.
   */
  title?: string;

  /**
   * Type of the page. The available types all show up under the /docs/ URL path of your docs project (also known as the "guides" section). Can be "basic" (most common), "error" (page desribing an API error), or "link" (page that redirects to an external link).
   */
  type?: "basic" | "error" | "link";

  /**
   * Body content of the page, formatted in [ReadMe-flavored Markdown](https://docs.readme.com/rdmd/docs).
   */
  body?: string;

  /**
   * Category ID of the page, which you can get through [the **Get all categories** endpoint](https://docs.readme.com/main/reference/getcategories).
   */
  category?: string;

  /**
   * Visibility of the page.
   */
  hidden?: boolean;

  /**
   * The position of the page in your project sidebar.
   */
  order?: integer;

  /**
   * The parent doc's ID, if the page is a subpage.
   */
  parentDoc?: string;

  error?: {
    code?: string;
  };
}

model version {
  /**
   * Semantic Version
   */
  version: string;

  /**
   * Dubbed name of version.
   */
  codename?: string;

  /**
   * Semantic Version to use as the base fork.
   */
  from: string;

  /**
   * Should this be the **main** version?
   */
  is_stable?: boolean;

  is_beta?: boolean = true;

  /**
   * Should this be publically accessible?
   */
  is_hidden?: boolean;

  /**
   * Should this be deprecated? Only allowed in PUT operations.
   */
  is_deprecated?: boolean;
}

model jobOpening {
  /**
   * A slugified version of the job opening title.
   */
  slug?: string;

  /**
   * The job opening position.
   */
  title?: string;

  /**
   * The description for this open position. This content is formatted as HTML.
   */
  description?: string;

  /**
   * A short pullquote for the open position.
   */
  pullquote?: string;

  /**
   * Where this position is located at.
   */
  location?: string;

  /**
   * The internal organization you'll be working in.
   */
  department?: string;

  /**
   * The place where you can apply for the position!
   */
  @format("url") url?: string;
}

model error_APIKEY_EMPTY {
  ...baseError;
  error?: string = "APIKEY_EMPTY";
}

model error_APIKEY_MISMATCH {
  ...baseError;
  error?: string = "APIKEY_MISMATCH";
}

model error_APIKEY_NOTFOUND {
  ...baseError;
  error?: string = "APIKEY_NOTFOUND";
}

model error_APPLY_INVALID_EMAIL {
  ...baseError;
  error?: string = "APPLY_INVALID_EMAIL";
}

model error_APPLY_INVALID_JOB {
  ...baseError;
  error?: string = "APPLY_INVALID_JOB";
}

model error_APPLY_INVALID_NAME {
  ...baseError;
  error?: string = "APPLY_INVALID_NAME";
}

model error_CATEGORY_INVALID {
  ...baseError;
  error?: string = "CATEGORY_INVALID";
}

model error_CATEGORY_NOTFOUND {
  ...baseError;
  error?: string = "CATEGORY_NOTFOUND";
}

model error_CHANGELOG_INVALID {
  ...baseError;
  error?: string = "CHANGELOG_INVALID";
}

model error_CHANGELOG_NOTFOUND {
  ...baseError;
  error?: string = "CHANGELOG_NOTFOUND";
}

model error_CUSTOMPAGE_INVALID {
  ...baseError;
  error?: string = "CUSTOMPAGE_INVALID";
}

model error_CUSTOMPAGE_NOTFOUND {
  ...baseError;
  error?: string = "CUSTOMPAGE_NOTFOUND";
}

model error_DOC_INVALID {
  ...baseError;
  error?: string = "DOC_INVALID";
}

model error_DOC_NOTFOUND {
  ...baseError;
  error?: string = "DOC_NOTFOUND";
}

model error_ENDPOINT_NOTFOUND {
  ...baseError;
  error?: string = "ENDPOINT_NOTFOUND";
}

model error_INTERNAL_ERROR {
  ...baseError;
  error?: string = "INTERNAL_ERROR";
}

model error_PROJECT_NEEDSSTAGING {
  ...baseError;
  error?: string = "PROJECT_NEEDSSTAGING";
}

model error_PROJECT_NOTFOUND {
  ...baseError;
  error?: string = "PROJECT_NOTFOUND";
}

model error_RATE_LIMITED {
  ...baseError;
  error?: string = "RATE_LIMITED";
}

model error_REGISTRY_INVALID {
  ...baseError;
  error?: string = "REGISTRY_INVALID";
}

model error_REGISTRY_NOTFOUND {
  ...baseError;
  error?: string = "REGISTRY_NOTFOUND";
}

model error_SPEC_FILE_EMPTY {
  ...baseError;
  error?: string = "SPEC_FILE_EMPTY";
}

model error_SPEC_ID_DUPLICATE {
  ...baseError;
  error?: string = "SPEC_ID_DUPLICATE";
}

model error_SPEC_ID_INVALID {
  ...baseError;
  error?: string = "SPEC_ID_INVALID";
}

model error_SPEC_INVALID {
  ...baseError;
  error?: string = "SPEC_INVALID";
}

model error_SPEC_INVALID_SCHEMA {
  ...baseError;
  error?: string = "SPEC_INVALID_SCHEMA";
}

model error_SPEC_NOTFOUND {
  ...baseError;
  error?: string = "SPEC_NOTFOUND";
}

model error_SPEC_TIMEOUT {
  ...baseError;
  error?: string = "SPEC_TIMEOUT";
}

model error_SPEC_VERSION_NOTFOUND {
  ...baseError;
  error?: string = "SPEC_VERSION_NOTFOUND";
}

model error_UNEXPECTED_ERROR {
  ...baseError;
  error?: string = "UNEXPECTED_ERROR";
}

model error_VERSION_CANT_DEMOTE_STABLE {
  ...baseError;
  error?: string = "VERSION_CANT_DEMOTE_STABLE";
}

model error_VERSION_CANT_REMOVE_STABLE {
  ...baseError;
  error?: string = "VERSION_CANT_REMOVE_STABLE";
}

model error_VERSION_DUPLICATE {
  ...baseError;
  error?: string = "VERSION_DUPLICATE";
}

model error_VERSION_EMPTY {
  ...baseError;
  error?: string = "VERSION_EMPTY";
}

model error_VERSION_FORK_EMPTY {
  ...baseError;
  error?: string = "VERSION_FORK_EMPTY";
}

model error_VERSION_FORK_NOTFOUND {
  ...baseError;
  error?: string = "VERSION_FORK_NOTFOUND";
}

model error_VERSION_INVALID {
  ...baseError;
  error?: string = "VERSION_INVALID";
}

model error_VERSION_NOTFOUND {
  ...baseError;
  error?: string = "VERSION_NOTFOUND";
}

/**
 * Successfully retrieved API registry entry.
 */
model getAPIRegistry200ApplicationJsonResponse {
  @statusCode statusCode: 200;
  @bodyRoot body: {};
}

/**
 * Successfully retrieved API specification metadata.
 */
model getAPISpecification200Response {
  @statusCode statusCode: 200;
}

/**
 * The API specification was successfully uploaded.
 */
model uploadAPISpecification201Response {
  @statusCode statusCode: 201;
}

/**
 * There was a validation error during upload.
 */
@error
model uploadAPISpecification400ApplicationJsonResponse {
  @statusCode statusCode: 400;
  @bodyRoot @oneOf body:
    | error_SPEC_FILE_EMPTY
    | error_SPEC_INVALID
    | error_SPEC_INVALID_SCHEMA
    | error_SPEC_VERSION_NOTFOUND;
}

/**
 * The API specification was deleted.
 */
model deleteAPISpecification204Response {
  @statusCode statusCode: 204;
}

/**
 * The API specification was updated.
 */
model updateAPISpecification200Response {
  @statusCode statusCode: 200;
}

/**
 * There was a validation error during upload.
 */
@error
model updateAPISpecification400ApplicationJsonResponse {
  @statusCode statusCode: 400;
  @bodyRoot @oneOf body:
    | error_SPEC_FILE_EMPTY
    | error_SPEC_ID_DUPLICATE
    | error_SPEC_ID_INVALID
    | error_SPEC_INVALID
    | error_SPEC_INVALID_SCHEMA
    | error_SPEC_VERSION_NOTFOUND;
}

/**
 * There is no API specification with that ID.
 */
@error
model updateAPISpecification404Response {
  @statusCode statusCode: 404;
}

/**
 * All the roles that we're hiring for.
 */
model getOpenRoles200ApplicationJsonResponse {
  @statusCode statusCode: 200;
  @bodyRoot body: jobOpening[];
}

/**
 * You did it!
 */
model applyToReadMe200Response {
  @statusCode statusCode: 200;
}

/**
 * The list of categories.
 */
model getCategories200Response {
  @statusCode statusCode: 200;
}

/**
 * The category has successfully been created.
 */
model createCategory201Response {
  @statusCode statusCode: 201;
}

/**
 * The category was deleted.
 */
model deleteCategory204Response {
  @statusCode statusCode: 204;
}

/**
 * The category exists and has been returned.
 */
model getCategory200Response {
  @statusCode statusCode: 200;
}

/**
 * The category was successfully updated.
 */
model updateCategory200Response {
  @statusCode statusCode: 200;
}

/**
 * The category exists and all of the docs have been returned.
 */
model getCategoryDocs200Response {
  @statusCode statusCode: 200;
}

/**
 * The list of changelogs.
 */
model getChangelogs200Response {
  @statusCode statusCode: 200;
}

/**
 * The changelog was successfully created.
 */
model createChangelog201Response {
  @statusCode statusCode: 201;
}

/**
 * There was a validation error during creation.
 */
@error
model createChangelog400Response {
  @statusCode statusCode: 400;
}

/**
 * The changelog was successfully updated.
 */
model deleteChangelog204Response {
  @statusCode statusCode: 204;
}

/**
 * There is no changelog with that slug.
 */
@error
model deleteChangelog404Response {
  @statusCode statusCode: 404;
}

/**
 * The changelog exists and has been returned.
 */
model getChangelog200Response {
  @statusCode statusCode: 200;
}

/**
 * There is no changelog with that slug.
 */
@error
model getChangelog404Response {
  @statusCode statusCode: 404;
}

/**
 * The changelog was successfully updated.
 */
model updateChangelog200Response {
  @statusCode statusCode: 200;
}

/**
 * There was a validation error during update.
 */
@error
model updateChangelog400Response {
  @statusCode statusCode: 400;
}

/**
 * There is no changelog with that slug.
 */
@error
model updateChangelog404Response {
  @statusCode statusCode: 404;
}

/**
 * The list of custom pages.
 */
model getCustomPages200Response {
  @statusCode statusCode: 200;
}

/**
 * The custom page was successfully created.
 */
model createCustomPage201Response {
  @statusCode statusCode: 201;
}

/**
 * The custom page was successfully updated.
 */
model deleteCustomPage204Response {
  @statusCode statusCode: 204;
}

/**
 * The custom page exists and has been returned.
 */
model getCustomPage200Response {
  @statusCode statusCode: 200;
}

/**
 * The custom page was successfully updated.
 */
model updateCustomPage200Response {
  @statusCode statusCode: 200;
}

/**
 * The doc was successfully updated.
 */
model deleteDoc204Response {
  @statusCode statusCode: 204;
}

/**
 * The doc exists and has been returned.
 */
model getDoc200ApplicationJsonResponse {
  @statusCode statusCode: 200;
  @bodyRoot body: docSchemaResponse;
}

/**
 * The doc was successfully updated.
 */
model updateDoc200ApplicationJsonResponse {
  @statusCode statusCode: 200;
  @bodyRoot body: docSchemaResponse;
}

/**
 * The doc exists and has been returned.
 */
model getProductionDoc200ApplicationJsonResponse {
  @statusCode statusCode: 200;
  @bodyRoot body: docSchemaResponse;
}

/**
 * The doc was successfully created.
 */
model createDoc201ApplicationJsonResponse {
  @statusCode statusCode: 201;
  @bodyRoot body: docSchemaResponse;
}

/**
 * The search was successful and results were returned.
 */
model searchDocs200Response {
  @statusCode statusCode: 200;
}

/**
 * Project data
 */
model getProject200ApplicationJsonResponse {
  @statusCode statusCode: 200;
  @bodyRoot body: condensedProjectData;
}

/**
 * OpenAPI Definition data
 */
model getAPISchema200ApplicationJsonResponse {
  @statusCode statusCode: 200;
  @bodyRoot body: {};
}

/**
 * A list of versions.
 */
model getVersions200Response {
  @statusCode statusCode: 200;
}

/**
 * The version was successfully created.
 */
model createVersion200Response {
  @statusCode statusCode: 200;
}

/**
 * There was a validation error during creation.
 */
@error
model createVersion400ApplicationJsonResponse {
  @statusCode statusCode: 400;
  @bodyRoot @oneOf body: error_VERSION_EMPTY | error_VERSION_DUPLICATE | error_VERSION_FORK_EMPTY;
}

/**
 * The version was successfully deleted.
 */
model deleteVersion200Response {
  @statusCode statusCode: 200;
}

/**
 * The version exists and has been returned.
 */
model getVersion200Response {
  @statusCode statusCode: 200;
}

/**
 * The version was successfully updated.
 */
model updateVersion200Response {
  @statusCode statusCode: 200;
}

/**
 * Get an API definition file that's been uploaded to ReadMe.
 */
@tag("API Registry")
@route("/api-registry/{uuid}")
@get
@summary("Retrieve an entry from the API Registry")
op getAPIRegistry(
  /**
   * An API Registry UUID. This can be found by navigating to your API Reference page and viewing code snippets for Node with the `api` library.
   */
  @path uuid: string,
): getAPIRegistry200ApplicationJsonResponse;

/**
 * Get API specification metadata.
 */
@tag("API Specification")
@route("/api-specification")
@get
@summary("Get metadata")
op getAPISpecification(
  ...Parameters.perPage,
  ...Parameters.page,
  ...Parameters.x_readme_version,
): getAPISpecification200Response;

/**
 * Upload an API specification to ReadMe. Or, to use a newer solution see https://docs.readme.com/main/docs/rdme.
 */
@tag("API Specification")
@route("/api-specification")
@post
@summary("Upload specification")
op uploadAPISpecification(
  ...Parameters.x_readme_version,
  @header contentType: "multipart/form-data",
  @bodyRoot body: {
    spec?: bytes;
  },
): uploadAPISpecification201Response | uploadAPISpecification400ApplicationJsonResponse;

/**
 * Delete an API specification in ReadMe.
 */
@tag("API Specification")
@route("/api-specification/{id}")
@delete
@summary("Delete specification")
op deleteAPISpecification(
  /**
   * ID of the API specification. The unique ID for each API can be found by navigating to your **API Definitions** page.
   */
  @path id: string,
): deleteAPISpecification204Response;

/**
 * Update an API specification in ReadMe.
 */
@tag("API Specification")
@route("/api-specification/{id}")
@put
@summary("Update specification")
op updateAPISpecification(
  /**
   * ID of the API specification. The unique ID for each API can be found by navigating to your **API Definitions** page.
   */
  @path id: string,

  @header contentType: "multipart/form-data",
  @bodyRoot body: {
    spec?: bytes;
  },
): updateAPISpecification200Response | updateAPISpecification400ApplicationJsonResponse | updateAPISpecification404Response;

/**
 * Returns all the roles we're hiring for at ReadMe!
 */
@tag("Apply to ReadMe")
@route("/apply")
@get
@summary("Get open roles")
op getOpenRoles(): getOpenRoles200ApplicationJsonResponse;

/**
 * This endpoint will let you apply to a job at ReadMe programatically, without having to go through our UI!
 */
@tag("Apply to ReadMe")
@route("/apply")
@post
@summary("Submit your application!")
op applyToReadMe(@bodyRoot body: apply): applyToReadMe200Response;

/**
 * Returns all the categories for a specified version.
 */
@tag("Categories")
@route("/categories")
@get
@summary("Get all categories")
op getCategories(
  ...Parameters.x_readme_version,
  ...Parameters.perPage,
  ...Parameters.page,
): getCategories200Response;

/**
 * Create a new category inside of this project.
 */
@tag("Categories")
@route("/categories")
@post
@summary("Create category")
op createCategory(
  ...Parameters.x_readme_version,
  @bodyRoot body: unknown,
): createCategory201Response;

/**
 * Delete the category with this slug.
 * >⚠️Heads Up!
 * > This will also delete all of the docs within this category.
 */
@tag("Categories")
@route("/categories/{slug}")
@delete
@summary("Delete category")
op deleteCategory(
  /**
   * A URL-safe representation of the category title. Slugs must be all lowercase, and replace spaces with hyphens. For example, for the category "Getting Started", enter the slug "getting-started".
   */
  @path slug: string,

  ...Parameters.x_readme_version,
): deleteCategory204Response;

/**
 * Returns the category with this slug.
 */
@tag("Categories")
@route("/categories/{slug}")
@get
@summary("Get category")
op getCategory(
  /**
   * A URL-safe representation of the category title. Slugs must be all lowercase, and replace spaces with hyphens. For example, for the category "Getting Started", enter the slug "getting-started".
   */
  @path slug: string,

  ...Parameters.x_readme_version,
): getCategory200Response;

/**
 * Change the properties of a category.
 */
@tag("Categories")
@route("/categories/{slug}")
@put
@summary("Update category")
op updateCategory(
  /**
   * A URL-safe representation of the category title. Slugs must be all lowercase, and replace spaces with hyphens. For example, for the category "Getting Started", enter the slug "getting-started".
   */
  @path slug: string,

  ...Parameters.x_readme_version,
  @bodyRoot body: category,
): updateCategory200Response;

/**
 * Returns the docs and children docs within this category.
 */
@tag("Categories")
@route("/categories/{slug}/docs")
@get
@summary("Get docs for category")
op getCategoryDocs(
  /**
   * A URL-safe representation of the category title. Slugs must be all lowercase, and replace spaces with hyphens. For example, for the category "Getting Started", enter the slug "getting-started".
   */
  @path slug: string,

  ...Parameters.x_readme_version,
): getCategoryDocs200Response;

/**
 * Returns a list of changelogs.
 */
@tag("Changelog")
@route("/changelogs")
@get
@summary("Get changelogs")
op getChangelogs(...Parameters.perPage, ...Parameters.page): getChangelogs200Response;

/**
 * Create a new changelog entry.
 */
@tag("Changelog")
@route("/changelogs")
@post
@summary("Create changelog")
op createChangelog(
  @bodyRoot body: changelog,
): createChangelog201Response | createChangelog400Response;

/**
 * Delete the changelog with this slug.
 */
@tag("Changelog")
@route("/changelogs/{slug}")
@delete
@summary("Delete changelog")
op deleteChangelog(
  /**
   * A URL-safe representation of the changelog title. Slugs must be all lowercase, and replace spaces with hyphens. For example, for the changelog "Owlet Weekly Update", enter the slug "owlet-weekly-update".
   */
  @path slug: string,
): deleteChangelog204Response | deleteChangelog404Response;

/**
 * Returns the changelog with this slug.
 */
@tag("Changelog")
@route("/changelogs/{slug}")
@get
@summary("Get changelog")
op getChangelog(
  /**
   * A URL-safe representation of the changelog title. Slugs must be all lowercase, and replace spaces with hyphens. For example, for the changelog "Owlet Update", enter the slug "owlet-update".
   */
  @path slug: string,
): getChangelog200Response | getChangelog404Response;

/**
 * Update a changelog with this slug.
 */
@tag("Changelog")
@route("/changelogs/{slug}")
@put
@summary("Update changelog")
op updateChangelog(
  /**
   * A URL-safe representation of the changelog title. Slugs must be all lowercase, and replace spaces with hyphens. For example, for the changelog "Owlet Weekly Update", enter the slug "owlet-weekly-update".
   */
  @path slug: string,

  @bodyRoot body: changelog,
): updateChangelog200Response | updateChangelog400Response | updateChangelog404Response;

/**
 * Returns a list of custom pages.
 */
@tag("Custom Pages")
@route("/custompages")
@get
@summary("Get custom pages")
op getCustomPages(...Parameters.perPage, ...Parameters.page): getCustomPages200Response;

/**
 * Create a new custom page inside of this project.
 */
@tag("Custom Pages")
@route("/custompages")
@post
@summary("Create custom page")
op createCustomPage(@bodyRoot body: customPage): createCustomPage201Response;

/**
 * Delete the custom page with this slug.
 */
@tag("Custom Pages")
@route("/custompages/{slug}")
@delete
@summary("Delete custom page")
op deleteCustomPage(...Parameters.slug): deleteCustomPage204Response;

/**
 * Returns the custom page with this slug.
 */
@tag("Custom Pages")
@route("/custompages/{slug}")
@get
@summary("Get custom page")
op getCustomPage(...Parameters.slug): getCustomPage200Response;

/**
 * Update a custom page with this slug.
 */
@tag("Custom Pages")
@route("/custompages/{slug}")
@put
@summary("Update custom page")
op updateCustomPage(...Parameters.slug, @bodyRoot body: customPage): updateCustomPage200Response;

/**
 * Delete the doc with this slug.
 */
@tag("Docs")
@route("/docs/{slug}")
@delete
@summary("Delete doc")
op deleteDoc(...Parameters.slug, ...Parameters.x_readme_version): deleteDoc204Response;

/**
 * Returns the doc with this slug.
 */
@tag("Docs")
@route("/docs/{slug}")
@get
@summary("Get doc")
op getDoc(...Parameters.slug, ...Parameters.x_readme_version): getDoc200ApplicationJsonResponse;

/**
 * Update a doc with this slug.
 */
@tag("Docs")
@route("/docs/{slug}")
@put
@summary("Update doc")
op updateDoc(
  ...Parameters.slug,
  ...Parameters.x_readme_version,
  @bodyRoot body: docSchemaPut,
): updateDoc200ApplicationJsonResponse;

/**
 * This is intended for use by enterprise users with staging enabled. This endpoint will return the live version of your document, whereas the standard endpoint will always return staging.
 */
@tag("Docs")
@route("/docs/{slug}/production")
@get
@summary("Get production doc")
op getProductionDoc(
  ...Parameters.slug,
  ...Parameters.x_readme_version,
): getProductionDoc200ApplicationJsonResponse;

/**
 * Create a new doc inside of this project.
 */
@tag("Docs")
@route("/docs")
@post
@summary("Create doc")
op createDoc(
  ...Parameters.x_readme_version,
  @bodyRoot body: docSchemaPost,
): createDoc201ApplicationJsonResponse;

/**
 * Returns all docs that match the search.
 */
@tag("Docs")
@route("/docs/search")
@post
@summary("Search docs")
op searchDocs(
  /**
   * Search string to look for.
   */
  @query(#{ explode: true }) search: string,

  ...Parameters.x_readme_version,
): searchDocs200Response;

/**
 * Returns project data for the API key.
 */
@tag("Projects")
@route("/")
@get
@summary("Get metadata about the current project")
op getProject(): getProject200ApplicationJsonResponse;

/**
 * Returns a copy of our OpenAPI Definition.
 */
@tag("API Specification")
@route("/schema")
@get
@summary("Get our OpenAPI Definition")
op getAPISchema(): getAPISchema200ApplicationJsonResponse;

/**
 * Retrieve a list of versions associated with a project API key.
 */
@tag("Version")
@route("/version")
@get
@summary("Get versions")
op getVersions(): getVersions200Response;

/**
 * Create a new version.
 */
@tag("Version")
@route("/version")
@post
@summary("Create version")
op createVersion(
  @bodyRoot body: version,
): createVersion200Response | createVersion400ApplicationJsonResponse;

/**
 * Delete a version
 */
@tag("Version")
@route("/version/{versionId}")
@delete
@summary("Delete version")
op deleteVersion(...Parameters.versionId): deleteVersion200Response;

/**
 * Returns the version with this version ID.
 */
@tag("Version")
@route("/version/{versionId}")
@get
@summary("Get version")
op getVersion(...Parameters.versionId): getVersion200Response;

/**
 * Update an existing version.
 */
@tag("Version")
@route("/version/{versionId}")
@put
@summary("Update version")
op updateVersion(...Parameters.versionId, @bodyRoot body: version): updateVersion200Response;

namespace Parameters {
  model slug {
    /**
     * A URL-safe representation of the page title. Slugs must be all lowercase, and replace spaces with hyphens. For example, for the title "Getting Started", enter the slug "getting-started".
     */
    @path slug: string;
  }
  model page {
    /**
     * Used to specify further pages (starts at 1).
     */
    @minValue(1) @query(#{ explode: true }) page?: integer = 1;
  }
  model perPage {
    /**
     * Number of items to include in pagination (up to 100, defaults to 10).
     */
    @minValue(1)
    @maxValue(100)
    @query(#{ explode: true })
    perPage?: integer = 10;
  }
  model x_readme_version {
    /**
     * Version number of your docs project, for example, v3.0. By default the main project version is used. To see all valid versions for your docs project call https://docs.readme.com/main/reference/version#getversions.
     */
    @header x_readme_version?: string;
  }
  model versionId {
    /**
     * Semver identifier for the project version. For best results, use the formatted `version_clean` value listed in the response from the [Get Versions endpoint](/reference/getversions).
     */
    @path versionId: string;
  }
}
