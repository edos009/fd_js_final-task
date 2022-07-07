fetch("./assets/js/data.json")
  .then((resolve) => resolve.json())
  .then((actors) => {
    const HTMLCollectionActors = actors.map((actor) => createActorCard(actor));

    actorsBlock.append(...HTMLCollectionActors);
  });

function createActorCard({
  id,
  firstName,
  lastName,
  profilePicture,
  contacts,
}) {
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
    { classNames: ["actor"] },
    actorAvatarBlock
  );

  return actor;
}

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
  actorsBlock
);

const container = createElement(
  "div",
  { classNames: ["container"] },
  actorsInner
);

const actors = createElement("section", { classNames: ["actors"] }, container);

document.body.append(actors);

// ____________________________________________

function handlerError({ target }) {
  target.remove();
}

function handlerLoadPhoto({ target }) {
  document.getElementById(target.dataset.wrapperId).append(target);
}

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

function createInitials(str) {
  return str
    .split(" ")
    .map((elem) => elem.slice(0, 1).toUpperCase())
    .join("");
}
