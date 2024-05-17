LINE_DOMAIN_API: "https://line-hml-8a44d.rj.r.appspot.com";

document.addEventListener("DOMContentLoaded", function () {
  fetch("https://line-b0ebd.rj.r.appspot.com/cities")
    .then((response) => response.json())
    .then((cities) => {
      const validCities = cities.filter(
        (city) => city !== null && city !== undefined
      ); // Filtra valores nulos
      initializeCities(validCities);
    })
    .catch((error) => {
      console.error("Erro ao buscar cidades:", error);
    });

  function initializeCities(cities) {
    var cityChecklistDiv = $("#cityChecklist");

    cities.forEach(function (city) {
      var checkboxHtml = `
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="${city}">
                    <label class="form-check-label" for="${city}">${city}</label>
                </div>`;
      cityChecklistDiv.append(checkboxHtml);
    });
  }

  $("#notifyBtn").click(function () {
    var title = $("#titleInput").val();
    var body = $("#messageInput").val();
    const isLinerChecked = $("#flexSwitchCheckDefault").prop("checked");
    const isEstabelecimentoChecked = $("#flexSwitchCheckChecked").prop(
      "checked"
    );
    const selectedCities = Array.from($("#cityChecklist input:checked")).map(
      (checkbox) => checkbox.id
    );

    if (!title || !body) {
      alert("Por favor, preencha o título e a mensagem.");
      return;
    }

    var payload = {
      title: title,
      body: body,
      isLinerChecked: isLinerChecked,
      isEstabelecimentoChecked: isEstabelecimentoChecked,
      selectedCities: selectedCities,
    };

    fetch("https://line-b0ebd.rj.r.appspot.com/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Falha ao enviar notificações");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Notificações enviadas:", data);
        $("#response").text("Notificações enviadas com sucesso!");
      })
      .catch((error) => {
        console.error("Erro ao enviar notificações:", error);
        $("#response").text("Erro ao enviar notificações: " + error.message);
      });
  });
});
