export default function WorkersManagement() {
  return (
    <div className="route-container">
      <div className="p-6 text-white">
        <h1 className="text-2xl font-bold mb-4">Workers Management</h1>

        {/* ADD WORKER */}
        <div className="mb-6 bg-gray-800 p-4 rounded-2xl shadow">
          <h2 className="text-xl mb-3 font-semibold">Add Worker</h2>
          <form className="grid gap-3 max-w-md">
            <input
              type="text"
              placeholder="Worker Name"
              className="p-2 rounded bg-gray-700 border border-gray-600"
            />

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 p-2 rounded-lg text-white font-medium"
            >
              Add Worker
            </button>
          </form>
        </div>

        {/* WORKERS LIST */}
        <div className="bg-gray-800 p-4 rounded-2xl shadow">
          <h2 className="text-xl mb-3 font-semibold">Current Workers</h2>

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-700">
                <th className="p-2">#</th>
                <th className="p-2">Name</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-700">
                <td className="p-2">1</td>
                <td className="p-2">John Doe</td>
                <td className="p-2 flex gap-3">
                  <button className="text-red-500">Remove</button>
                </td>
              </tr>

              <tr className="border-b border-gray-700">
                <td className="p-2">2</td>
                <td className="p-2">Alice</td>
                <td className="p-2 flex gap-3">
                  <button className="text-red-500">Remove</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
