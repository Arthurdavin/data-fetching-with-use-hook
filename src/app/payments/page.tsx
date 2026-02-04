import { columns, Payment } from "./columns"
import { DataTable } from "./data-table"

type Product = {
  id: number;
  price: number;
};

async function getData(): Promise<Payment[]> {
  // Fetch data from your API here.
  const res = await fetch("https://api.escuelajs.co/api/v1/products",{
    cache: "no-cache", // it always get fresh data from the server.
  });
  const products: Product[] = await res.json();
  // return [
  //   {
  //     id: "728ed52f",
  //     amount: 100,
  //     status: "processing",
  //     email: "n@example.com",

  //   },
  // ]
  return products.slice(0,20).map((item)=>({
    id:String(item.id),
    amount:item.price,
    status: 
     item.id % 3 ===0
     ?"success"
     :item.id%3 ===1 
     ?"pending"
    :"processing",
    email:"davin@gmail.com", 
  }))
}

export default async function PaymentPage() {
  const data = await getData()

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  )
}


