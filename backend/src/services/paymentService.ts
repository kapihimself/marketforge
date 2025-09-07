import Midtrans from 'midtrans-client';
import { servicesConfig } from '../config/database';

export class PaymentService {
  private snap: any;
  private coreApi: any;

  constructor() {
    // Initialize Midtrans Snap
    this.snap = new Midtrans.Snap({
      isProduction: servicesConfig.midtrans.isProduction,
      serverKey: servicesConfig.midtrans.serverKey,
      clientKey: servicesConfig.midtrans.clientKey,
    });

    // Initialize Midtrans Core API
    this.coreApi = new Midtrans.CoreApi({
      isProduction: servicesConfig.midtrans.isProduction,
      serverKey: servicesConfig.midtrans.serverKey,
      clientKey: servicesConfig.midtrans.clientKey,
    });
  }

  /**
   * Create payment token for Snap
   */
  async createPaymentToken(orderData: {
    orderId: string;
    amount: number;
    customerDetails: {
      firstName: string;
      lastName: string;
      email: string;
      phone?: string;
    };
    itemDetails: Array<{
      id: string;
      price: number;
      quantity: number;
      name: string;
    }>;
  }): Promise<{ token: string; redirectUrl: string }> {
    try {
      const parameter = {
        transaction_details: {
          order_id: orderData.orderId,
          gross_amount: orderData.amount,
        },
        customer_details: {
          first_name: orderData.customerDetails.firstName,
          last_name: orderData.customerDetails.lastName,
          email: orderData.customerDetails.email,
          phone: orderData.customerDetails.phone || '',
        },
        item_details: orderData.itemDetails,
        callbacks: {
          finish: `${process.env.FRONTEND_URL}/payment/success`,
          pending: `${process.env.FRONTEND_URL}/payment/pending`,
          error: `${process.env.FRONTEND_URL}/payment/error`,
        },
      };

      const response = await this.snap.createTransaction(parameter);
      
      return {
        token: response.token,
        redirectUrl: response.redirect_url,
      };
    } catch (error) {
      console.error('Midtrans payment token creation failed:', error);
      throw new Error('Payment initialization failed');
    }
  }

  /**
   * Create payment using Core API (for server-to-server)
   */
  async createPayment(orderData: {
    orderId: string;
    amount: number;
    customerDetails: {
      firstName: string;
      lastName: string;
      email: string;
      phone?: string;
    };
    itemDetails: Array<{
      id: string;
      price: number;
      quantity: number;
      name: string;
    }>;
    paymentType?: 'credit_card' | 'bank_transfer' | 'echannel' | 'gopay' | 'shopeepay';
  }): Promise<any> {
    try {
      const parameter: any = {
        payment_type: orderData.paymentType || 'credit_card',
        transaction_details: {
          order_id: orderData.orderId,
          gross_amount: orderData.amount,
        },
        customer_details: {
          first_name: orderData.customerDetails.firstName,
          last_name: orderData.customerDetails.lastName,
          email: orderData.customerDetails.email,
          phone: orderData.customerDetails.phone || '',
        },
        item_details: orderData.itemDetails,
      };

      // Add payment-specific parameters
      if (orderData.paymentType === 'credit_card') {
        parameter.credit_card = {
          secure: true,
        };
      } else if (orderData.paymentType === 'bank_transfer') {
        parameter.bank_transfer = {
          bank: 'bca', // Default to BCA, can be made configurable
        };
      }

      const response = await this.coreApi.charge(parameter);
      return response;
    } catch (error) {
      console.error('Midtrans payment creation failed:', error);
      throw new Error('Payment creation failed');
    }
  }

  /**
   * Verify payment status
   */
  async verifyPayment(orderId: string): Promise<any> {
    try {
      const response = await this.coreApi.transaction.status(orderId);
      return response;
    } catch (error) {
      console.error('Midtrans payment verification failed:', error);
      throw new Error('Payment verification failed');
    }
  }

  /**
   * Handle payment notification (webhook)
   */
  async handleNotification(notificationData: any): Promise<any> {
    try {
      const statusResponse = await this.coreApi.transaction.notification(notificationData);
      
      const orderId = statusResponse.order_id;
      const transactionStatus = statusResponse.transaction_status;
      const fraudStatus = statusResponse.fraud_status;

      console.log(`Payment notification for order ${orderId}: ${transactionStatus}`);

      return {
        orderId,
        transactionStatus,
        fraudStatus,
        statusResponse,
      };
    } catch (error) {
      console.error('Midtrans notification handling failed:', error);
      throw new Error('Notification handling failed');
    }
  }

  /**
   * Cancel payment
   */
  async cancelPayment(orderId: string): Promise<any> {
    try {
      const response = await this.coreApi.transaction.cancel(orderId);
      return response;
    } catch (error) {
      console.error('Midtrans payment cancellation failed:', error);
      throw new Error('Payment cancellation failed');
    }
  }

  /**
   * Refund payment
   */
  async refundPayment(orderId: string, amount?: number, reason?: string): Promise<any> {
    try {
      const parameter: any = {
        refund_key: `refund-${orderId}-${Date.now()}`,
      };

      if (amount) {
        parameter.amount = amount;
      }

      if (reason) {
        parameter.reason = reason;
      }

      const response = await this.coreApi.transaction.refund(orderId, parameter);
      return response;
    } catch (error) {
      console.error('Midtrans payment refund failed:', error);
      throw new Error('Payment refund failed');
    }
  }

  /**
   * Get available payment methods
   */
  getAvailablePaymentMethods(): Array<{
    id: string;
    name: string;
    type: string;
    enabled: boolean;
  }> {
    return [
      {
        id: 'credit_card',
        name: 'Credit Card',
        type: 'card',
        enabled: true,
      },
      {
        id: 'bank_transfer',
        name: 'Bank Transfer',
        type: 'bank',
        enabled: true,
      },
      {
        id: 'gopay',
        name: 'GoPay',
        type: 'ewallet',
        enabled: true,
      },
      {
        id: 'shopeepay',
        name: 'ShopeePay',
        type: 'ewallet',
        enabled: true,
      },
      {
        id: 'echannel',
        name: 'Mandiri E-Channel',
        type: 'bank',
        enabled: true,
      },
    ];
  }
}

export const paymentService = new PaymentService();
