import { useState, useEffect, Key } from "react";
import WebApp from "@twa-dev/sdk";

function ShowSplit({ params }: { params: { slug: string } }) {
    const { slug } = params;
    const [result, setResult] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const ID = WebApp.initDataUnsafe.user?.id || "Unknown ID";

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response: Response = await fetch('/api/showsplit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        ID: ID,
                        groupID: slug,
                    }),
                });

                if (!response.ok) {
                    throw new Error(`No result`);
                }

                const result = await response.json();
                setResult(result);
            } catch (error: any) {
                console.error('Error fetching split:', error);
                setError(error.message);
            }
        };

        fetchData();
    }, [ID, slug]);

    const renderTableBody = (isReceivable: boolean) => {
        return result.map((splitEntry: any) => (
            splitEntry.splitMembers
                .filter((member: { split_member: string | number; }) => 
                    (isReceivable ? member.split_member !== String(ID) && splitEntry.payer === String(ID) 
                                  : member.split_member === String(ID) && splitEntry.payer !== String(ID))
                )
                .map((member: { _id: Key | null | undefined; name: string; amount: number; state: number }) => (
                    <tr key={member._id}>
                        <td className="border px-4 py-2">
                            {true ? member.name : splitEntry.name}
                        </td>
                        <td className="border px-4 py-2">{member.amount}</td>
                        <td className="border px-4 py-2">
                            {member.state === 0 ? "unpaid" : member.state === 1 ? "paid" : "payer"}
                        </td>
                        {member.state === 0 && (
                            <td className="border px-4 py-2">
                                <button>Pay</button>
                            </td>
                        )}
                    </tr>
                ))
        ));
    };

    return (
        <div>
            {error && <p>{error}</p>}
            
            {/* Receivable Table */}
            <h2>Receivable Table</h2>
            <table className="min-w-full bg-white border text-black">
                <thead>
                    <tr>
                        <th className="py-2 border">Split Member</th>
                        <th className="py-2 border">Amount</th>
                        <th className="py-2 border">State</th>
                        <th className="py-2 border">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {renderTableBody(true)}
                </tbody>
            </table>

            {/* Payable Table */}
            <h2>Payable Table</h2>
            <table className="min-w-full bg-white border text-black">
                <thead>
                    <tr>
                        <th className="py-2 border">Payer</th>
                        <th className="py-2 border">Amount</th>
                        <th className="py-2 border">State</th>
                        <th className="py-2 border">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {renderTableBody(false)}
                </tbody>
            </table>
        </div>
    );
}

export default ShowSplit;