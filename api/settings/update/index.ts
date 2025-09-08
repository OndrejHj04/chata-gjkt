"use server"

import { query } from "@/lib/db";

export const updateSettings = async (data: any) => {
  try {
    const {
      main_application_email,
      registration_document_spreadsheet,
      whole_object,
      public_payment,
      employees_payment,
      ZO_payment,
      bank_account_number,
      payment_symbol_format,
    } = data;

    const req = (await query({
      query: `UPDATE settings SET 
    main_application_email = ?, 
    registration_document_spreadsheet = ?,
    whole_object = ?,
    public_payment = ?,
    employees_payment = ?,
    ZO_payment = ?,
    bank_account_number = ?,
    payment_symbol_format	= ?
    `,
      values: [
        main_application_email,
        registration_document_spreadsheet,
        whole_object,
        public_payment,
        employees_payment,
        ZO_payment,
        bank_account_number,
        payment_symbol_format,
      ],
    })) as any;

    return { success: req.changedRows };
  } catch (e) {
    if (data.payment_symbol_format.length > 10) {
      return {
        success: false,
        msg: "Formát variabilního symbolu musí mít 10 nebo méně znaků",
      };
    }
    return { success: false };
  }
};
