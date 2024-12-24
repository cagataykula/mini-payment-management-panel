
# Payment Dashboard Case

## About the Project

This project is built using **Next.js** with the **Pages Router**. For the user interface, I’ve used **Material UI**, which was recommended in the case study document. I've used **Axios** for making HTTP requests, as it provides a reliable way to communicate with the backend. For testing, I’ve integrated **Jest** to make sure the application works properly and is free of bugs. 

I’ve utilized the **Context API** for state management because this is a relatively small project. Using Context API allows me to manage global state efficiently without the need to deal with the additional complexity of **Redux Toolkit**.

## Why I Chose Next.js

I chose Next.js for this project for several reasons:


**Built-in Routing**: I chose Next.js because it offers a built-in routing system, which simplifies navigation within the app. This feature saves time and effort, especially for complex applications.

**Mock API Support**: Next.js allows me to easily create mock APIs, making it easier to work with data during development. This speeds up the development process and helps test functionality before backend integration.

**React Documentation Recommendation**: According to the official React documentation, Next.js is a recommended framework for building React applications, which made it a natural choice for this project.

## Installation

Follow these steps to install the project dependencies:
```bash
npm install
```

## Running the Project

To run the project locally, use the following commands:

- Start the development server:

```bash
npm run dev
```

- For production build:

```bash
npm run build
npm start
```

## Testing

Run tests:

```bash
    npm run test
```


## Features

## Reusable DataTable Component

### Props
| Prop Name | Type | Description | Required | Default Value |
|--------|---------|---------------|---------|--------------|
| `data` | `array` | Array of data that you want | ✅ |
| `columns` | `array` of `Column` | Columns of your data that you want to shown | ✅ |
| `filters` | `array` of `FilterConfig` | Filters that you want to show | ❌ | `undefined`
| `isLoading` | `boolean` | Table loader indicator | ❌ | `false`
| `title` | `string` | Table title text | ❌ | `undefined` 
| `initialSort` | `object` | Initial sort of your table | ❌ | `{ field: 'id', direction: 'desc' }`
| `exportable` | `boolean` | It makes table exportable in csv format by default | ❌ | `false`
| `exportFilename` | `string` | Export file name | ❌ | `exported-data.csv`

### Events
| Prop Name | Type | Description | Required | Default Value |
|--------|---------|---------------|---------|--------------|
| `onRowClick` | `function` | A function when user clicks to the row of your table. Returns `row` object of your data.  | ❌ | `undefined`

### Detailed Props

#### Data
It just needs to be array of objects. For example:

```js
[
	{
		"id": 1,
		"name": "Cagatay",
		"surname": "Kula"
	},
	...
]
```

#### Columns

| Key | Value | Is required | Description |
| ---- | --- | -------- | ----------- |
| `key` | `string` | ✅ | It needs to matches with your data objects key if you didn't used render key.
| `label` | `string` | ✅ |
| `align` | `left/right/center` | ❌ |
| `sortable` | `boolean` | ❌ |
| `render` | `function` | ❌ |


*Example:*
```js
[
	{
		"key": "id",
		"label": "ID",
	},
	{
		"key": "name",
		"label": "Name Surname",
		render: (value, row) => `${row.name} ${row.surname}`
	}
]
```

It will render a table like this: 

| ID | Name Surname |
| --- | --------- |
| 1 | Cagatay Kula |
| ... | ... |

<br>
<br>

#### Filters

*Example:*
```js
[
	{
		"key": "search",
		"label": "Search",
		"type": "text",
		"searchKeys": ["id", "name", "surname"],
		"placeholder": "Write id or customer name"
	},
	...
]
```

### Filter Types:

**Base Filter** (Common for every type of filter)
| Key | Value | Is required | Description |
| ---- | --- | -------- | ----------- |
| `key` | `string` | ✅ | It needs to matches with your data objects key if you didn't filterFor key. | 
| `label` | `string` | ✅ | Name of the filter.
| `type` | `text|number|select|dateRange` | ✅ | type of the filter.
| `filterFor` | `string` | ❌ | Sometimes you want to add two filter area for one data key. For example we have amount data and we want to add min and max amount. We can write `amount` for filterFor and any unique id to the `key`

<br>

**Text Filter** (Extends Base Filter)
| Key | Value | Is required | Description |
| ---- | --- | -------- | ----------- |
| `searchKeys` | `array` of `string` | ❌ | If you want to search multiple area in a one input just write the keys of data. | 
| `placeholder` | `string` | ❌ | Input Placeholder.

<br>

**Number Filter** (Extends Base Filter)
| Key | Value | Is required | Description |
| ---- | --- | -------- | ----------- |
| `comparisonType` | `greater/less/equal/greaterOrEqual/lessOrEqual` | ❌   If you want to search multiple area in a one input just write the keys of data. |

<br>

**Select Filter** (Extends Base Filter)
| Key | Value | Is required | Description |
| ---- | --- | -------- | ----------- |
| `options` | `array` of `objects` | ✅ | Select box options. |

*Example:*
```js
[
	{
	"value": "all"
	"label": "All"
	},
	{
	"value": "success"
	"label": "Successful"
	},
		{
	"value": "declined"
	"label": "Declined"
	},
]
```
