<script setup lang="ts">
const tabs: Record<string, any> = [
  {
    id: "clasificacion",
    name: "Clasificación",
    type: "link",
    route: "/",
    icon: "fa6-solid:trophy"
  },/*
  {
    id: "premios",
    name: "Premios",
    type: "link",
    route: "/premios",
    icon: "fa6-solid:award"
  }*/
];

const { currentRoute, beforeEach } = useRouter();
const canonical = computed(() => SITE.host + currentRoute.value.path. replace(/\/+$/, ""));

useHead({
  link: [
    { rel: "canonical", href: canonical }
  ]
});

beforeEach(({ name }) => {
  currentRoute.value.name = name;
});
</script>

<template>
  <nav class="navbar navbar-expand-lg sticky-top navbar-dark bg-secondary shadow-lg" data-bs-theme="dark">
    <div class="container-xl px-xl-5">
      <button class="navbar-toggler border-0 rounded-pill" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon" />
      </button>
      <div class="navbar-brand ms-2 ms-lg-0 me-auto d-flex align-items-center gap-1 text-decoration-none">
        <span><img src="/images/muelitaschallenge.svg" width="40">&nbsp;&nbsp;{{ SITE.title }}</span>
      </div>
      <div id="offcanvasNavbar" class="offcanvas offcanvas-start bg-secondary" tabindex="-1" aria-labelledby="offcanvasNavbarLabel">
        <div class="offcanvas-header px-4 pt-4 pb-0">
          <span width="45">{{ SITE.title }}</span>
          <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close" />
        </div>
        <div class="offcanvas-body">
          <ul class="navbar-nav justify-content-end flex-grow-1 gap-1 fw-bold">
            <template v-for="(tab, i) of tabs" :key="i">
              <li class="nav-item px-1" data-bs-dismiss="offcanvas">
                <NuxtLink class="nav-link d-flex align-items-center gap-1 position-relative overflow-hidden rounded px-3" aria-current="page" :to="tab.route">
                  <Icon :name="tab.icon" />
                  <span>{{ tab.name }}</span>
                </NuxtLink>
              </li>
            </template>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>