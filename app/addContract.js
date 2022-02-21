import {ethers} from 'ethers';

const provider = new ethers.providers.Web3Provider(ethereum);

export default async function addContract(id, contract, arbiter, beneficiary, value) {
  const buttonId = `approve-${id}`;
  console.log(buttonId);

  const container = document.getElementById("container");
  container.innerHTML += createHTML(id, buttonId, arbiter, beneficiary, value);

  contract.on('Approved', () => {
    document.getElementById(buttonId).className = "complete";
    document.getElementById(buttonId).innerHTML = "✓ It's been approved!";
    document.getElementById(buttonId).style.pointerEvents = 'none';
  });

  document.getElementById(buttonId).addEventListener("click", async () => {
    console.log("click fired for: " + buttonId);
    const signer = provider.getSigner();
    try {
      await contract.connect(signer).approve();
      document.getElementById(buttonId).innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
      Loading...`;
    } catch(error) {
      console.log("error: " , error);
    }
  });
}

function createHTML(id, buttonId, arbiter, beneficiary, value) {
  let dispArbiter = arbiter.substr(0,6) + "..." + arbiter.substr(38);
  let dispBeneficiary = beneficiary.substr(0,6) + "..." + beneficiary.substr(38);
  let dispValue = value/(10**18)

  return `
  <tr>
    <th scope="row"> ${id} </th>
    <td> ${dispArbiter} </td>
    <td> ${dispBeneficiary} </td>
    <td> ${dispValue} eth</td>
    <td>
      <div id="${buttonId}" class="btn btn-primary">Approve</div> 
    </td>
  </tr>
  `;
}
