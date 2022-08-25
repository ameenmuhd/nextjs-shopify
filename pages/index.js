import React, { Fragment, useEffect } from "react";
import "@shopify/polaris/build/esm/styles.css";
import enTranslations from "@shopify/polaris/locales/en.json";
import {
  ChoiceList,
  TextField,
  Card,
  Filters,
  AppProvider,
  Layout,
  Page,
  Modal,
  IndexTable,
  Thumbnail,
  Button,
  TextStyle,
  TextContainer,
  DisplayText,
} from "@shopify/polaris";
import { useState, useCallback } from "react";

export default function Home({ products }) {
  const [category, setCategory] = useState(null);
  const [productType, setProductType] = useState(null);
  const [taggedWith, setTaggedWith] = useState(null);
  const [queryValue, setQueryValue] = useState(null);
  const [rows, setRows] = useState([]);
  const [active, setActive] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState({});

  const handleChange = useCallback((product) => {
    setActive(!active), [active];
    setSelectedProduct(product);
  });

  useEffect(() => {
    const categoryProducts = [];
    products.map((product) => {
      if (!isEmpty(category)) {
        if (category.includes(product.category)) {
          categoryProducts.push(product);
        }
      } else {
        categoryProducts.push(product);
      }
    });

    const createRows = [];
    categoryProducts.map((product, id) => {
      if (queryValue) {
        if (product.title.toLowerCase().includes(queryValue.toLowerCase())) {
          createRows.push(
            <IndexTable.Row id={product.id} key={product.id} position={id}>
              <IndexTable.Cell>
                <TextStyle variation="strong">{product.id}</TextStyle>
              </IndexTable.Cell>
              <IndexTable.Cell>
                <Thumbnail
                  source={product.image}
                  alt={limit(product.title)}
                  size="small"
                />
              </IndexTable.Cell>
              <IndexTable.Cell>{limit(product.title, 20)}</IndexTable.Cell>
              <IndexTable.Cell>{product.category}</IndexTable.Cell>
              <IndexTable.Cell>{product.price}</IndexTable.Cell>
              <IndexTable.Cell>{product.rating.rate}</IndexTable.Cell>
              <IndexTable.Cell>
                {limit(product.description, 20)}
              </IndexTable.Cell>
              <IndexTable.Cell>
                <Button primary onClick={() => handleChange(product)}>
                  View
                </Button>
              </IndexTable.Cell>
            </IndexTable.Row>
          );
        }
      } else {
        createRows.push(
          <IndexTable.Row id={product.id} key={product.id} position={id}>
            <IndexTable.Cell>
              <TextStyle variation="strong">{product.id}</TextStyle>
            </IndexTable.Cell>
            <IndexTable.Cell>
              <Thumbnail
                source={product.image}
                alt={limit(product.title)}
                size="small"
              />
            </IndexTable.Cell>
            <IndexTable.Cell>{limit(product.title, 20)}</IndexTable.Cell>
            <IndexTable.Cell>{product.category}</IndexTable.Cell>
            <IndexTable.Cell>{product.price}</IndexTable.Cell>
            <IndexTable.Cell>{product.rating.rate}</IndexTable.Cell>
            <IndexTable.Cell>{limit(product.description, 20)}</IndexTable.Cell>
            <IndexTable.Cell>
              <Button primary onClick={() => handleChange(product)}>
                View
              </Button>
            </IndexTable.Cell>
          </IndexTable.Row>
        );
      }
    });
    setRows(createRows);
  }, [category, queryValue]);

  const handleCategoryChange = useCallback((value) => setCategory(value), []);
  const handleProductTypeChange = useCallback(
    (value) => setProductType(value),
    []
  );
  const handleTaggedWithChange = useCallback(
    (value) => setTaggedWith(value),
    []
  );
  const handleFiltersQueryChange = useCallback(
    (value) => setQueryValue(value),
    []
  );
  const handleCategoryRemove = useCallback(() => setCategory(null), []);
  const handleProductTypeRemove = useCallback(() => setProductType(null), []);
  const handleTaggedWithRemove = useCallback(() => setTaggedWith(null), []);
  const handleQueryValueRemove = useCallback(() => setQueryValue(null), []);
  const handleFiltersClearAll = useCallback(() => {
    handleCategoryRemove();
    handleProductTypeRemove();
    handleTaggedWithRemove();
    handleQueryValueRemove();
  }, [
    handleCategoryRemove,
    handleQueryValueRemove,
    handleProductTypeRemove,
    handleTaggedWithRemove,
  ]);

  const filters = [
    {
      key: "category",
      label: "Category",
      filter: (
        <ChoiceList
          title="Category"
          titleHidden
          choices={[
            { label: "Men", value: "men's clothing" },
            { label: "Women", value: "women's clothing" },
            { label: "Electronics", value: "electronics" },
            { label: "Jewelery", value: "jewelery" },
          ]}
          selected={category || []}
          onChange={handleCategoryChange}
          allowMultiple
        />
      ),
      shortcut: true,
    },
    {
      key: "productType",
      label: "Product type",
      filter: (
        <ChoiceList
          title="Product type"
          titleHidden
          choices={[
            { label: "T-Shirt", value: "T-Shirt" },
            { label: "Accessory", value: "Accessory" },
            { label: "Gift card", value: "Gift card" },
          ]}
          selected={productType || []}
          onChange={handleProductTypeChange}
          allowMultiple
        />
      ),
    },
    {
      key: "taggedWith",
      label: "Tagged with",
      filter: (
        <TextField
          label="Tagged with"
          value={taggedWith}
          onChange={handleTaggedWithChange}
          autoComplete="off"
          labelHidden
        />
      ),
    },
  ];

  const limit = (string, length, end = "...") => {
    return string.length < length ? string : string.substring(0, length) + end;
  };

  const appliedFilters = [];
  if (!isEmpty(category)) {
    const key = "category";
    appliedFilters.push({
      key,
      label: disambiguateLabel(key, category),
      onRemove: handleCategoryRemove,
    });
  }
  if (!isEmpty(productType)) {
    const key = "productType";
    appliedFilters.push({
      key,
      label: disambiguateLabel(key, productType),
      onRemove: handleProductTypeRemove,
    });
  }
  if (!isEmpty(taggedWith)) {
    const key = "taggedWith";
    appliedFilters.push({
      key,
      label: disambiguateLabel(key, taggedWith),
      onRemove: handleTaggedWithRemove,
    });
  }

  return (
    <AppProvider i18n={enTranslations}>
      <Page singleColumn title="Products List">
        <Layout>
          <Layout.Section>
            <Card sectioned>
              <Card.Section>
                <Filters
                  queryValue={queryValue}
                  filters={filters}
                  appliedFilters={appliedFilters}
                  onQueryChange={handleFiltersQueryChange}
                  onQueryClear={handleQueryValueRemove}
                  onClearAll={handleFiltersClearAll}
                />
              </Card.Section>
              <IndexTable
                itemCount={rows.length}
                selectable={false}
                headings={[
                  { title: "Id" },
                  { title: "Image" },
                  { title: "Product" },
                  { title: "Category" },
                  { title: "Price" },
                  { title: "Rating" },
                  { title: "Description" },
                ]}
              >
                {rows}
              </IndexTable>
            </Card>
          </Layout.Section>
        </Layout>

        <Modal
          open={active}
          onClose={handleChange}
          title={selectedProduct.title}
        >
          <Modal.Section>
            <img
              src={selectedProduct.image}
              style={{
                width: "300px",
                height: "300px",
                margin: "0 auto",
                display: "block",
              }}
            />
          </Modal.Section>
          <Modal.Section>
            <TextContainer>
              <DisplayText size="large">Description:</DisplayText>
              <p>{selectedProduct.description}</p>
            </TextContainer>
          </Modal.Section>
          <Modal.Section>
            <TextContainer>
              <DisplayText size="medium">Rating:</DisplayText>
              <p>
                <TextStyle variation="strong">Rating : </TextStyle>
                {selectedProduct.rating?.rate}
              </p>
              <p>
                <TextStyle variation="strong">Rated by : </TextStyle>
                {selectedProduct.rating?.count}
              </p>
            </TextContainer>
          </Modal.Section>
        </Modal>
      </Page>
    </AppProvider>
  );

  function disambiguateLabel(key, value) {
    switch (key) {
      case "taggedWith":
        return `Tagged with ${value}`;
      case "availability":
        return value.map((val) => `Available on ${val}`).join(", ");
      case "productType":
        return value.join(", ");
      default:
        return value;
    }
  }

  function isEmpty(value) {
    if (Array.isArray(value)) {
      return value.length === 0;
    } else {
      return value === "" || value == null;
    }
  }
}

export async function getStaticProps({ params }) {
  const req = await fetch(`https://fakestoreapi.com/products`);
  const data = await req.json();

  return {
    props: { products: data },
  };
}
