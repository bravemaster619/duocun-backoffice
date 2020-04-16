import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";

import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "components/Table/TablePagniation.js";
import TableRow from "@material-ui/core/TableRow";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import Avatar from "@material-ui/core/Avatar";
import LocalMallIcon from "@material-ui/icons/LocalMall";
import TableBodySkeleton from "components/Table/TableBodySkeleton";
import Searchbar from "components/Searchbar/Searchbar";
import ApiProductService from "services/api/ApiProductService";
import { getQueryParam } from "helper/index";
const useStyles = makeStyles(() => ({
  table: {
    minWidth: 750
  }
}));

export default function Product({ location }) {
  const { t } = useTranslation();
  const classes = useStyles();
  const [products, setProducts] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(
    getQueryParam(location, "page")
      ? parseInt(getQueryParam(location, "page"))
      : 0
  );
  const [query, setQuery] = useState(getQueryParam(location, "search") || "");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const updateData = () => {
    ApiProductService.getProductList(page, rowsPerPage, query).then(
      ({ data }) => {
        setProducts(data.data);
        setTotalRows(data.meta.count);
        setLoading(false);
      }
    );
  };
  const renderRows = rows => {
    if (!rows.length) {
      return (
        <TableRow>
          <TableCell align="center" colSpan={7}>
            {t("No data to display")}
          </TableCell>
        </TableRow>
      );
    }
    return (
      <>
        {rows.map((row, idx) => (
          <TableRow key={idx}>
            <TableCell>{page * rowsPerPage + idx + 1}</TableCell>
            <TableCell>
              <Avatar
                variant="square"
                alt="product"
                src={
                  row.pictures && row.pictures[0] ? row.pictures[0].url : "#"
                }
              >
                <LocalMallIcon></LocalMallIcon>
              </Avatar>
            </TableCell>
            <TableCell>{row.name}</TableCell>
            <TableCell>{row.price.toFixed(2)}</TableCell>
            <TableCell>{row.cost.toFixed(2)}</TableCell>
            <TableCell>
              {row.featured ? (
                <CheckIcon color="primary"></CheckIcon>
              ) : (
                <CloseIcon color="error"></CloseIcon>
              )}
            </TableCell>
            <TableCell>
              <IconButton aria-label="edit">
                <EditIcon></EditIcon>
              </IconButton>
              <IconButton aria-label="delete">
                <DeleteIcon></DeleteIcon>
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
      </>
    );
  };

  useEffect(() => {
    updateData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage]);

  return (
    <div>
      <GridContainer>
        <GridItem xs={12}>
          <Card>
            <CardHeader color="primary">
              <GridContainer>
                <GridItem xs={12} lg={6}>
                  <h4>{t("Products")}</h4>
                </GridItem>
                <GridItem xs={12} lg={6} align="right">
                  <Searchbar
                    onChange={e => {
                      const { target } = e;
                      setQuery(target.value);
                    }}
                    onSearch={() => {
                      setLoading(true);
                      if (page === 0) {
                        updateData();
                      } else {
                        setPage(0);
                      }
                    }}
                  />
                </GridItem>
              </GridContainer>
            </CardHeader>
            <CardBody>
              <GridContainer>
                <GridItem xs={12}>
                  <TableContainer>
                    <Table
                      className={classes.table}
                      aria-label="Product Table"
                      size="small"
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell>#</TableCell>
                          <TableCell>{t("Image")}</TableCell>
                          <TableCell>{t("Name")}</TableCell>
                          <TableCell>{t("Price")}</TableCell>
                          <TableCell>{t("Cost")}</TableCell>
                          <TableCell>{t("Featured")}</TableCell>
                          <TableCell>{t("Actions")}</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {loading ? (
                          <TableBodySkeleton colCount={7} />
                        ) : (
                          renderRows(products)
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </GridItem>
              </GridContainer>
            </CardBody>
            <CardFooter>
              {!loading && (
                <TablePagination
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onChangePage={(e, newPage) => setPage(newPage)}
                  count={totalRows}
                  onChangeRowsPerPage={({ target }) => {
                    setPage(0);
                    setRowsPerPage(target.value);
                  }}
                ></TablePagination>
              )}
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}

Product.propTypes = {
  location: PropTypes.object
};
