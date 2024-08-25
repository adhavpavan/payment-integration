import React, { useEffect, useState } from 'react';
import { loadStripe } from "@stripe/stripe-js";
import { Card, Radio, Button, Space, Typography, message } from 'antd';
import { CreditCardOutlined, DollarOutlined } from '@ant-design/icons';
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from './checkout';
const stripePromise = loadStripe("pk_test_51PIiC8SHPAWrfFFltkCtAxSaSAzbG7dkFVMx4XiPtQhTpCtbuOqupbnVOdC0AVnnZGM6EMI8HileD6WI8qMESYBr00KyWOxqqQ");


const { Title, Text } = Typography;

const PaymentGatewaySelection = () => {
    const [selectedGateway, setSelectedGateway] = useState(null);
    const [clientSecret, setClientSecret] = useState("");
    const appearance = {
        theme: 'stripe',
      };

      useEffect(()=> {
        console.log("Secret changed --------", clientSecret)
      }, [clientSecret])
      const options = {
        clientSecret,
        appearance,
      };


      const getIntent = ()=> {
        fetch("http://localhost:4005/v1/payment/stripe/intent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount: 1000 }),
          })
            .then((res) => res.json())
            .then((data) => {
                console.log("-------data--------", data)
                setClientSecret(data.clientSecret)
            });
      }
    
    useEffect(() => {
        // Create PaymentIntent as soon as the page loads
       
      }, []);

    const loadScript = (src) => {
        return new Promise((resovle) => {
            const script = document.createElement("script");
            script.src = src;

            script.onload = () => {
                resovle(true);
            };

            script.onerror = () => {
                resovle(false);
            };

            document.body.appendChild(script);
        });
    };

    // razorpay = new Razorpay();
    const startRazorPayPayment = async () => {

        const res = await loadScript(
            "https://checkout.razorpay.com/v1/checkout.js"
        );

        if (!res) {
            alert("You are offline... Failed to load Razorpay SDK");
            return;
        }

        const options = {
            key: "rzp_test_3hYTuAgrLbo99m",
            currency: "INR",
            amount: 19999 * 100,
            name: "Pavan Tech Academy",
            description: "Thanks for purchasing",
            customer: {
                name: "Pavan",
                email: "adhavpavan@gmail.com"
            },
            // image:
            //   "https://mern-blog-akky.herokuapp.com/static/media/logo.8c649bfa.png",

            handler: function (response) {
                // alert(response.razorpay_payment_id);
                // alert("Payment Successfully");
            },
            notes: {
                name: "Pavan",
                email: "adhavpavan@gmail.com"
            },
            prefill: {
                name: "Pavan Tech Academy",
            },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();


    }
    const handleGatewayChange = (e) => {
        setSelectedGateway(e.target.value);
    };

    //   const 

    const handlePayment = () => {
        if (!selectedGateway) {
            message.error('Please select a payment gateway');
            return;
        }
        if (selectedGateway == 'Razorpay') {
            startRazorPayPayment()

        } else {
            getIntent()
        }

        message.success(`Initiating payment with ${selectedGateway}`);
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <Space direction="vertical" size="large" style={{ width: '800px', maxWidth: '100%' }}>
                <Title level={2} style={{ textAlign: 'center' }}>Select Payment Gateway</Title>
                <Radio.Group onChange={handleGatewayChange} value={selectedGateway} style={{ width: '100%' }}>
                    <Space direction="vertical" size="large" style={{ width: '100%' }}>
                        <Card
                            hoverable
                            style={{
                                width: '100%',
                                borderColor: selectedGateway === 'Razorpay' ? '#1890ff' : undefined
                            }}
                        >
                            <Radio value="Razorpay">
                                <Space>
                                    <CreditCardOutlined style={{ fontSize: '24px', color: '#528FF0' }} />
                                    <Text strong>Razorpay</Text>
                                </Space>
                            </Radio>
                            <Text type="secondary" style={{ marginLeft: 32 }}>Fast and secure payments</Text>
                        </Card>
                        <Card
                            hoverable
                            style={{
                                width: '100%',
                                borderColor: selectedGateway === 'Stripe' ? '#1890ff' : undefined
                            }}
                        >
                            <Radio value="Stripe">
                                <Space>
                                    <DollarOutlined style={{ fontSize: '24px', color: '#635BFF' }} />
                                    <Text strong>Stripe</Text>
                                </Space>
                            </Radio>
                            <Text type="secondary" style={{ marginLeft: 32 }}>Global payment solution</Text>
                            
                        </Card>
                        {(clientSecret ) && (
                                <Elements options={options}  stripe={stripePromise}>
                                <Card>
                                <CheckoutForm/>
                                </Card>
                                </Elements>
                            )}
                    </Space>
                </Radio.Group>
                <Button type="primary" size="large" onClick={handlePayment} disabled={!selectedGateway} style={{ width: '100%' }}>
                    Proceed to Payment
                </Button>
            </Space>
        </div>
    );
};

export default PaymentGatewaySelection;