const socialMap = new Map();
socialMap.set("www.facebook.com", "fa-facebook-f");
socialMap.set("twitter.com", "fa-twitter");
socialMap.set("www.instagram.com", "fa-instagram");

const listActors = [];

fetch("./assets/js/data.json")
  .then((resolve) => resolve.json())
  .then((actors) => {
    const HTMLCollectionActors = actors
      .filter((actor) => actor.firstName || actor.lastName)
      .map((actor) => createActorCard(actor));

    actorsBlock.append(...HTMLCollectionActors);
  })
  .catch(() => {
    const errorText = createElement(
      "p",
      {
        classNames: ["error-text"],
      },
      document.createTextNode(
        "Sorry, there was a technical problem, please try again later!"
      )
    );

    const error = createElement("div", { classNames: ["error"] }, errorText);

    const errorOpacity = createElement("div", {
      classNames: ["error-opacity"],
    });

    document.body.style.overflow = "hidden";
    document.body.append(errorOpacity, error);
  });

function createActorCard({
  id,
  firstName,
  lastName,
  profilePicture,
  contacts,
}) {
  const actorSocialCollection = contacts.map((item) => {
    const hostNameLink = new URL(item).hostname;
    return createElement(
      "div",
      {
        classNames: ["actor-social"],
      },
      createElement("a", {
        classNames: [
          "actor-social-link",
          "fa-brands",
          socialMap.get(hostNameLink),
        ],
        attributes: { href: item, target: "_blank" },
        events: { click: handlerSocialClick}
      })
    );
  });

  const actorSocials = createElement(
    "div",
    {
      classNames: ["actor-socials"],
    },
    ...actorSocialCollection
  );

  const actorFIO = createElement(
    "h2",
    {
      classNames: ["actor-fio"],
    },
    document.createTextNode(`${firstName} ${lastName}`)
  );

  const actorInitials = createElement(
    "div",
    {
      classNames: ["actor-initials"],
      styles: {
        backgroundColor: stringToColour(
          `${firstName} ${lastName}`.trim() || "Not Name"
        ),
      },
    },
    document.createTextNode(
      createInitials(`${firstName} ${lastName}`.trim() || "Not Name")
    )
  );

  const actorAvatar = createElement("img", {
    classNames: ["actor-avatar"],
    attributes: {
      src: profilePicture,
      alt: `${firstName} ${lastName}`,
      "data-wrapper-id": `actor-avatar-circle-${id}`,
    },
    events: { error: handlerError, load: handlerLoadPhoto },
  });

  const actorAvatarCircle = createElement(
    "div",
    {
      classNames: ["actor-avatar-circle"],
      attributes: {
        id: `actor-avatar-circle-${id}`,
      },
    },
    actorInitials
  );

  const actorAvatarBlock = createElement(
    "div",
    {
      classNames: ["actor-avatar-block"],
    },
    actorAvatarCircle
  );

  const actor = createElement(
    "article",
    {
      classNames: ["actor"],
      events: { click: addActorToList },
    },
    actorAvatarBlock,
    actorFIO,
    actorSocials
  );

  return actor;
}

const actorListSpan = createElement(
  "span",
  {},
  document.createTextNode("You choosed")
);

const actorList = createElement(
  "ul",
  { classNames: ["actors-list"] },
  actorListSpan
);

const actorsBlock = createElement("div", { classNames: ["actors-block"] });

const actorsTitle = createElement(
  "h1",
  { classNames: ["actors-title"] },
  document.createTextNode("Actors")
);

const actorsInner = createElement(
  "div",
  { classNames: ["actors-inner"] },
  actorsTitle,
  actorsBlock,
  actorList
);

const container = createElement(
  "div",
  { classNames: ["container"] },
  actorsInner
);

const actors = createElement("section", { classNames: ["actors"] }, container);

document.body.append(actors);

// Функции и Оброботчики событий

//Обработчик на добавление актера в список
function addActorToList({ target }) {
  const actorNode = target.closest('.actor').querySelector('.actor-fio');
  
  if (!actorNode) {
    return;
  }

  const fioCurrentActor = actorNode.textContent;

  if (!listActors.includes(fioCurrentActor)) {
    actorListSpan.style.display = "none";

    listActors.push(fioCurrentActor);
    const actorItem = createElement(
      "li",
      { classNames: ["actor-item"] },
      document.createTextNode(fioCurrentActor)
    );
    actorList.append(actorItem);
  }
}
// Обработчик на ошибку
function handlerSocialClick(e){
  e.stopPropagation();
}

function handlerError({ target }) {
  target.remove();
}
// Обработчик на загрузку
function handlerLoadPhoto({ target }) {
  document.getElementById(target.dataset.wrapperId).append(target);
}
//Функция для создания любого элемента, его классов, стилей, атрибутов, событий и добавления в DOM
function createElement(
  tag,
  { classNames = [], styles = {}, attributes = {}, events = {} },
  ...children
) {
  const element = document.createElement(tag);

  if (classNames.length) {
    element.classList.add(...classNames);
  }

  for (const [nameStyle, valueStyle] of Object.entries(styles)) {
    element.style[nameStyle] = valueStyle;
  }

  for (const [nameAttr, valueAttr] of Object.entries(attributes)) {
    element.setAttribute(nameAttr, valueAttr);
  }

  for (const [typeEvent, handlerEvent] of Object.entries(events)) {
    element.addEventListener(typeEvent, handlerEvent);
  }

  element.append(...children);

  return element;
}
//Функция для трансформации строки в цвет
function stringToColour(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let colour = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    colour += ("00" + value.toString(16)).slice(-2);
  }
  return colour;
}
//Функция для трасформация имени и фамилии в инициалы
function createInitials(str) {
  return str
    .split(" ")
    .map((elem) => elem.slice(0, 1).toUpperCase())
    .join("");
}
