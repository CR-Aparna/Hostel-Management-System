from app.models.invoice_item import InvoiceItem
def add_invoice_item(db, invoice_id, type, description, amount):
    item = InvoiceItem(
        invoice_id=invoice_id,
        type=type,
        description=description,
        amount=amount
    )
    db.add(item)