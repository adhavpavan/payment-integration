
const createPayment = async (data) => {
  console.log('--razor pay data----', data);

  try {
    let t = {
      txId: data?.payload?.payment?.entity?.id,
      email: data?.payload?.payment?.entity?.notes?.email,
      name: data?.payload?.payment?.entity?.notes?.name,
      amount:data?.payload?.payment?.entity?.amount,
      currency: data?.payload?.payment?.entity?.currency,
      status: data?.payload?.payment?.entity?.status,
      fee:data?.payload?.payment?.entity?.fee,
      event: data?.event,
    };
    console.log('-------------txData--------------', t, txData);




    
  } catch (error) {
    console.log("Error occurred---------", error)
  }
};

module.exports = {
  createPayment,
};
