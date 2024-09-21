import { useState, useEffect } from "react";
import WebApp from "@twa-dev/sdk";

function ShowSplit({ params }: { params: { slug: string } }) {
    const { slug } = params;
    const [result, setResult] = useState<any[]>([]);  // Expecting an array of split data
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
                    const errorText = await response.text();
                    throw new Error(`No result`);
                }

                const result = await response.json();
                setResult(result);
            } catch (error: any) {
                console.error('Error fetching split:', error);
                setError(error.message);  // <-- Update error state
            }
        };

        fetchData();
    }, [ID, slug]);

    return (
        <div>
            {error && <p>{error}</p>}
            {result.length > 0 ? (
                <div>
                    {result.map((splitEntry: any, index: number) => (
                        <div key={index} style={{ marginBottom: "20px" }}>
                            <h3>Payer: {splitEntry.payer}</h3>
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
                                    {splitEntry.splitMembers.map((member: any) => (
                                        <tr key={member._id}>
                                            <td className="border px-4 py-2">{member.split_member}</td>
                                            <td className="border px-4 py-2">{member.amount}</td>
                                            <td className="border px-4 py-2">
                                                {member.state === 0
                                                    ? "unpaid"
                                                    : member.state === 1
                                                        ? "paid"
                                                        : "payer"}
                                            </td>
                                            {member.state === 0 && member.split_member === ID && (
                                                <td className="border px-4 py-2">
                                                    <button>Pay</button>
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ))}
                </div>
            ) : (
                <>
                    <p>groupID: {slug}</p>
                    <p>userID: {ID}</p>
                    <p>No split data available.</p>
                </>
            )}
        </div>
    );
}

export default ShowSplit;