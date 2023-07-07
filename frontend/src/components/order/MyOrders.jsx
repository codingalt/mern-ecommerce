import React, { useEffect } from "react";
import Loader from "../Loader";
import MetaData from "../MetaData";
import { DataGrid } from "@mui/x-data-grid";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { clear_errors, myOrders } from "../../features/order/ordersSlice";
import LaunchIcon from "@mui/icons-material/Launch";
import { NavLink, useParams } from "react-router-dom";
import { getOrderDetails } from "../../features/order/orderDetailsSlice";
import { Box, useMediaQuery } from "@mui/material";

const MyOrders = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const isMobile = useMediaQuery('(max-width: 600px)');
  // const params = useParams()
  const { loading, orders, error } = useSelector((state) => state.orders);
  const { user } = useSelector((state) => state.user);
  const columns = [
    {
      field: "id",
      headerName: "Order ID",
      minWidth: 130,
      flex: 1,
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 100,
      flex: 0.7,
      cellClassName: (params) => {
        return params.row.status === "Delivered" ? "text-green" : "text-blue";
      },
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 70,
      flex: 0.5,
    },
    {
      field: "amount",
      headerName: "Amount",
      type: "number",
      minWidth: 80,
      flex: 1,
    },
    {
      field: "actions",
      headerName: "Actions",
      type: "number",
      minWidth: 70,
      flex: 0.5,
      sortable: false,
      renderCell: (params) => {
        const id = params.row.id;
        return (
          <NavLink to={`/order/${id}`} className='text-violet-500 hover:text-pink-500'>
            <LaunchIcon style={{ fontSize: '20px' }} />
          </NavLink>
        );
      },
    },
  ];
  const rows = [];
  orders &&
    orders.forEach((item, index) => {
      rows.push({
        id: item._id,
        status: item.orderStatus,
        itemsQty: item.orderItems.length,
        amount: item.totalPrice,
      });
    });

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clear_errors());
    }
    dispatch(myOrders());
    // dispatch(getOrderDetails('64199eaa7744fcee5225de20'))
  }, [dispatch, error, alert]);
  return (
    <>
      <MetaData title={`${user.name} - Orders`} />
      {loading ? (
        <Loader />
      ) : (
        orders.length > 0 ? (
          <div className="pt-24 pb-10 border-2 border-red-500">
            <div className="w-[95%] md:w-[94%] lg:w-[90%] mx-auto">
              <Box
                // width='90%'
                mx='auto'
                sx={{
                  '.text-green': {
                    color: 'green'
                  },
                  '.text-blue': {
                    color: 'blue'
                  },
                  '>div': {
                    fontSize: isMobile ? '14px' : '16px',
                  },
                  '& .MuiDataGrid-columnHeaders': {
                    borderBottom: 'none',
                    backgroundColor: 'rgb(209 213 219)'
                  },
                  '& .MuiDataGrid-columnHeaderTitle': {
                    fontSize: isMobile ? '14px' : '16px',
                    fontWeight: '600',
                    color: 'grey'
                  },
                }}
              >
                <DataGrid
                  rows={rows}
                  columns={columns}
                  pageSizeOptions={[10]}
                  disableRowSelectionOnClick
                  autoHeight
                  className="text-2xl"
                />
                <div className="bg-gray-300 text-center text-base py-1.5 font-semibold">{`${user.name}'s Orders`}</div>
              </Box>
            </div>
          </div>
        )
          :
          (
            <div className='w-[90%] h-[60vh] mx-auto flex flex-col justify-center items-center gap-4 pt-10'>
              {/* <RemoveShoppingCartIcon className='text-4xl text-orange-500' style={{ fontSize: '40px' }} /> */}
              <h2 className="text-lg text-orange-500 font-extrabold">No orders available at the moment</h2>
              <p className="text-gray-500 text-sm">Please click the button below and place the order </p>
              <NavLink to='/products' className='bg-gray-400 hover:bg-gray-500 shadow-sm font-semibold text-white border-none outline-0 py-4 px-5'>View Products</NavLink>
            </div>
          )
      )}
    </>
  );
};

export default MyOrders;