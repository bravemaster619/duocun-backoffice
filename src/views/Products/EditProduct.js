import React, { useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";

import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Box from "@material-ui/core/Box";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";

import Skeleton from "@material-ui/lab/Skeleton";
import Alert from "@material-ui/lab/Alert";
import CustomInput from "components/CustomInput/CustomInput";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";

import FormatListBulletedIcon from "@material-ui/icons/FormatListBulleted";
import SaveIcon from "@material-ui/icons/Save";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import CancelIcon from "@material-ui/icons/Cancel";

import FlashStorage from "services/FlashStorage";

const useStyles = makeStyles(() => ({
  textarea: {
    width: "100%"
  },
  select: {
    width: "100%",
    marginTop: 27
  },
  heading: {
    marginBottom: "0.5rem",
    size: "1.5rem",
    fontWeight: 600
  },
  table: {
    minWidth: 750
  },
  editingCell: {
    padding: "0 5px"
  }
}));

const defaultModelState = {
  _id: "new",
  name: "",
  nameEN: "",
  description: "",
  descriptionEN: "",
  price: 0,
  cost: 0,
  stock: {
    enabled: true,
    quantity: 300,
    outofstockMessage: "",
    outofstockMessageEN: ""
  },
  attributes: [
    {
      name: "尺寸",
      nameEN: "Size",
      values: [
        {
          name: "M",
          nameEN: "M",
          price: 10,
          cost: 9,
          quantity: 200
        },
        {
          name: "L",
          nameEN: "L",
          price: 11,
          cost: 10,
          quantity: 170
        }
      ]
    },
    {
      name: "颜色",
      nameEN: "Color",
      values: [
        {
          name: "红色",
          nameEN: "Red",
          price: 10,
          cost: 10,
          quantity: 100
        }
      ]
    }
  ]
};

const defaultAttributeModelState = {
  attrIdx: -1,
  valIdx: -1,
  price: 0,
  cost: 0,
  quantity: 0
};

const EditProductSkeleton = () => (
  <React.Fragment>
    <GridItem xs={12} lg={6}>
      <Skeleton height={48} />
    </GridItem>
    <GridItem xs={12} lg={6}>
      <Skeleton height={48} />
    </GridItem>
    <GridItem xs={12} lg={6}>
      <Skeleton height={48} />
    </GridItem>
    <GridItem xs={12} lg={6}>
      <Skeleton height={48} />
    </GridItem>
    <GridItem xs={12} lg={6}>
      <Skeleton height={48} />
    </GridItem>
    <GridItem xs={12} lg={6}>
      <Skeleton height={48} />
    </GridItem>
    <GridItem xs={12} lg={6}>
      <Skeleton height={240} />
    </GridItem>
    <GridItem xs={12} lg={6}>
      <Skeleton height={240} />
    </GridItem>
  </React.Fragment>
);

const EditAttributeRow = ({ row, onSave, onCancel, ...extraProps }) => {
  const [model, setModel] = useState(row || defaultAttributeModelState);
  const classes = useStyles();
  return (
    <TableRow {...extraProps}>
      <TableCell>{model.attrName + " : " + model.valName}</TableCell>
      <TableCell className={classes.editingCell}>
        <TextField
          inputProps={{
            value: model.price,
            onChange: e => setModel({ ...model, price: e.target.value })
          }}
          size="small"
        />
      </TableCell>
      <TableCell className={classes.editingCell}>
        <TextField
          inputProps={{
            value: model.cost,
            onChange: e => setModel({ ...model, cost: e.target.value })
          }}
          size="small"
        />
      </TableCell>
      <TableCell className={classes.editingCell}>
        <TextField
          inputProps={{
            value: model.quantity,
            onChange: e => setModel({ ...model, quantity: e.target.value })
          }}
          size="small"
        />
      </TableCell>
      <TableCell>
        <IconButton onClick={() => onSave(model, row)}>
          <SaveIcon />
        </IconButton>
        <IconButton onClick={() => onCancel(model, row)}>
          <CancelIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

const AttributeTable = ({ attributes, processing, onSave, onDelete }) => {
  const { t } = useTranslation();
  const [editRow, setEditRow] = useState({
    attrIdx: -1,
    valIdx: -1
  });
  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>{t("Combinations")}</TableCell>
            <TableCell>{t("Price")}</TableCell>
            <TableCell>{t("Cost")}</TableCell>
            <TableCell>{t("Quantity")}</TableCell>
            <TableCell>{t("Actions")}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(!attributes || !attributes.length) && (
            <TableRow>
              <TableCell align="center" colSpan={5}>
                {t("No data to display")}
              </TableCell>
            </TableRow>
          )}
          {attributes &&
            attributes.length > 0 &&
            attributes.map((attribute, attrIdx) =>
              attribute.values.map((value, valIdx) =>
                editRow.attrIdx === attrIdx && editRow.valIdx === valIdx ? (
                  <EditAttributeRow
                    key={attrIdx + "_" + valIdx}
                    row={{
                      attrName: attribute.name,
                      valName: value.name,
                      price: value.price,
                      cost: value.cost,
                      quantity: value.quantity
                    }}
                    onSave={model => {
                      onSave(attrIdx, valIdx, model);
                      setEditRow({ attrIdx: -1, valIdx: -1 });
                    }}
                    onCancel={() => setEditRow({ attrIdx: -1, valIdx: -1 })}
                  />
                ) : (
                  <TableRow key={attrIdx + "_" + valIdx}>
                    <TableCell>{attribute.name + " : " + value.name}</TableCell>
                    <TableCell>{value.price}</TableCell>
                    <TableCell>{value.cost}</TableCell>
                    <TableCell>{value.quantity}</TableCell>
                    <TableCell>
                      <IconButton
                        disabled={processing}
                        onClick={() => setEditRow({ attrIdx, valIdx })}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        disabled={processing}
                        onClick={() => onDelete(attrIdx, valIdx)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                )
              )
            )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const EditProduct = () => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [model, setModel] = useState(defaultModelState);

  const [alert, setAlert] = useState(
    FlashStorage.get("PRODUCT_ALERT") || { message: "", severity: "info" }
  );

  const removeAlert = () => {
    setAlert({
      message: "",
      severity: "info"
    });
  };

  return (
    <GridContainer>
      <GridItem xs={12}>
        <Card>
          <CardHeader color="primary">
            {loading && <h4>{t("Product")}</h4>}
            {!loading && (
              <h4>
                {model._id && model._id !== "new"
                  ? t("Edit Product") + ": " + model.name
                  : t("Add Product")}
              </h4>
            )}
          </CardHeader>
          <CardBody>
            <GridContainer>
              {!!alert.message && (
                <GridItem xs={12}>
                  <Alert severity={alert.severity} onClose={removeAlert}>
                    {alert.message}
                  </Alert>
                </GridItem>
              )}
              {loading && <EditProductSkeleton />}
              {!loading && (
                <React.Fragment>
                  <GridItem xs={12} lg={7}>
                    <GridContainer>
                      <GridItem xs={12}>
                        <h5 className={classes.heading}>
                          {t("Basic Information")}
                        </h5>
                      </GridItem>
                      <GridItem xs={12} lg={6}>
                        <Box pb={2}>
                          <CustomInput
                            labelText={t("Product Name (Chinese)")}
                            id="product-name"
                            formControlProps={{
                              fullWidth: true
                            }}
                            inputProps={{
                              value: model.name,
                              onChange: e => {
                                setModel({ ...model, name: e.target.value });
                              }
                            }}
                          />
                        </Box>
                      </GridItem>
                      <GridItem xs={12} lg={6}>
                        <Box pb={2}>
                          <CustomInput
                            labelText={t("Product Name (English)")}
                            id="product-name-english"
                            formControlProps={{
                              fullWidth: true
                            }}
                            inputProps={{
                              value: model.nameEN,
                              onChange: e => {
                                setModel({ ...model, nameEN: e.target.value });
                              }
                            }}
                          />
                        </Box>
                      </GridItem>
                      <GridItem xs={12} lg={6}>
                        <Box py={2}>
                          <TextField
                            id="product-description"
                            label={t("Description (Chinese)")}
                            multiline
                            rowsMax={4}
                            onChange={e => {
                              setModel({
                                ...model,
                                description: e.target.value
                              });
                            }}
                            variant="outlined"
                            value={model.description}
                            className={classes.textarea}
                          />
                        </Box>
                      </GridItem>
                      <GridItem xs={12} lg={6}>
                        <Box py={2}>
                          <TextField
                            id="product-description-english"
                            label={t("Description (English)")}
                            multiline
                            rowsMax={4}
                            onChange={e => {
                              setModel({
                                ...model,
                                descriptionEN: e.target.value
                              });
                            }}
                            variant="outlined"
                            value={model.descriptionEN}
                            className={classes.textarea}
                          />
                        </Box>
                      </GridItem>
                      <GridItem xs={12} lg={6}>
                        <Box pb={2}>
                          <CustomInput
                            labelText={t("Price")}
                            id="product-price"
                            formControlProps={{
                              fullWidth: true
                            }}
                            inputProps={{
                              value: model.price,
                              onChange: e => {
                                setModel({ ...model, price: e.target.value });
                              }
                            }}
                          />
                        </Box>
                      </GridItem>
                      <GridItem xs={12} lg={6}>
                        <Box pb={2}>
                          <CustomInput
                            labelText={t("Cost")}
                            id="product-cost"
                            formControlProps={{
                              fullWidth: true
                            }}
                            inputProps={{
                              value: model.cost,
                              onChange: e => {
                                setModel({ ...model, cost: e.target.value });
                              }
                            }}
                          />
                        </Box>
                      </GridItem>
                      <GridItem xs={12}>
                        <h5 className={classes.heading}>{t("Stock")}</h5>
                      </GridItem>
                      <GridItem xs={12} lg={6}>
                        <Box pb={2}>
                          <FormControl className={classes.select}>
                            <InputLabel id="product-stock-enabled-label">
                              {t("Enabled")}
                            </InputLabel>
                            <Select
                              labelId="product-stock-enabled-label"
                              id="product-stock-enabled"
                              value={model.stock.enabled}
                              onChange={e => {
                                const newModel = { ...model };
                                newModel.stock.enabled = e.target.value;
                                setModel(newModel);
                              }}
                            >
                              <MenuItem value={false}>{t("No")}</MenuItem>
                              <MenuItem value={true}>{t("Yes")}</MenuItem>
                            </Select>
                          </FormControl>
                        </Box>
                      </GridItem>
                      <GridItem xs={12} lg={6}>
                        <Box pb={2}>
                          <CustomInput
                            labelText={t("Quantity")}
                            id="product-quantity"
                            formControlProps={{
                              fullWidth: true
                            }}
                            inputProps={{
                              value: model.cost,
                              onChange: e => {
                                setModel({ ...model, cost: e.target.value });
                              }
                            }}
                          />
                        </Box>
                      </GridItem>
                      <GridItem xs={12} lg={6}>
                        <Box py={2}>
                          <TextField
                            id="product-outofstock-message"
                            label={t("Out of stock Message (Chinese)")}
                            multiline
                            rowsMax={4}
                            onChange={e => {
                              const newModel = { ...model };
                              newModel.stock.outofstockMessage = e.target.value;
                              setModel(newModel);
                            }}
                            variant="outlined"
                            value={model.stock.outofstockMessage}
                            className={classes.textarea}
                          />
                        </Box>
                      </GridItem>
                      <GridItem xs={12} lg={6}>
                        <Box py={2}>
                          <TextField
                            id="product-outofstock-message-english"
                            label={t("Out of stock Message (English)")}
                            multiline
                            rowsMax={4}
                            onChange={e => {
                              const newModel = { ...model };
                              newModel.stock.outofstockMessageEN =
                                e.target.value;
                              setModel(newModel);
                            }}
                            variant="outlined"
                            value={model.stock.outofstockMessageEN}
                            className={classes.textarea}
                          />
                        </Box>
                      </GridItem>
                    </GridContainer>
                  </GridItem>
                  <GridItem xs={12} lg={5}>
                    <GridContainer>
                      <GridItem xs={12}>
                        <h5 className={classes.heading}>{t("Category")}</h5>
                      </GridItem>
                    </GridContainer>
                  </GridItem>
                </React.Fragment>
              )}
              <GridItem xs={12}>
                <h5 className={classes.heading}>{t("Combinations")}</h5>
                <GridContainer>
                  <GridItem xs={12} lg={7}>
                    <AttributeTable
                      processing={processing}
                      attributes={model.attributes}
                      onSave={(attrIdx, valIdx, value) => {
                        const newModel = { ...model };
                        newModel.attributes[attrIdx].values[valIdx] = {
                          ...newModel.attributes[attrIdx].values[valIdx],
                          price: value.price,
                          cost: value.cost,
                          quantity: value.quantity
                        };
                        setModel(newModel);
                      }}
                      onDelete={(attrIdx, valIdx) => {
                        const newModel = { ...model };
                        const attribute = newModel.attributes[attrIdx];
                        attribute.values.splice(valIdx, 1);
                        if (!attribute.values.length) {
                          newModel.attributes.splice(attrIdx, 1);
                        }
                        setModel(newModel);
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} lg={5}></GridItem>
                </GridContainer>
              </GridItem>
              <GridItem xs={12} container direction="row-reverse">
                <Box>
                  <Button variant="contained" href="../products">
                    <FormatListBulletedIcon />
                    {t("Back")}
                  </Button>
                </Box>
                <Box mr={2}>
                  <Button
                    color="primary"
                    variant="contained"
                    disabled={loading || processing || !model.name}
                    // onClick={saveModel}
                  >
                    <SaveIcon />
                    {t("Save")}
                  </Button>
                </Box>
              </GridItem>
            </GridContainer>
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
};

EditAttributeRow.propTypes = {
  row: PropTypes.shape({
    attrName: PropTypes.string,
    valName: PropTypes.string,
    price: PropTypes.number,
    cost: PropTypes.number,
    quantity: PropTypes.number
  }),
  onSave: PropTypes.func,
  onCancel: PropTypes.func
};

AttributeTable.propTypes = {
  attributes: PropTypes.array,
  processing: PropTypes.bool,
  onDelete: PropTypes.func,
  onSave: PropTypes.func
};

export default EditProduct;
