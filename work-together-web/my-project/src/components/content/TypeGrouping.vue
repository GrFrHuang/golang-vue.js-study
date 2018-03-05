<template>
  <div>
    <div class="nav-tabs-custom" id="mgt_header">
      <ul class="nav nav-tabs">
        <li class="active">
          <router-link to="/home/TypeGrouping/TypeGroupinga" href="#tab_1" data-toggle="tab">游戏类型</router-link>
        </li>
        <li>
          <router-link to="/home/TypeGrouping/Cooperation" href="#tab_2" data-toggle="tab">合作方式</router-link>
        </li>
        <li>
          <router-link to="/home/TypeGrouping/union" href="#tab_5" data-toggle="tab">公会政策</router-link>
        </li>
        <li>
          <router-link to="/home/TypeGrouping/Evaluation" href="#tab_6" data-toggle="tab">评测结果</router-link>
        </li>
        <li>
          <router-link to="/home/TypeGrouping/AccessStatus" href="#tab_7" data-toggle="tab">SDK接入状态</router-link>
        </li>
        <li>
          <router-link to="/home/TypeGrouping/AlarmRules" href="#tab_8" data-toggle="tab">报警规则</router-link>
        </li>
        <li>
          <router-link to="/home/TypeGrouping/Express" href="#tab_9" data-toggle="tab">快递方式</router-link>
        </li>
        <li>
          <router-link to="/home/TypeGrouping/ContractStatus" href="#tab_10" data-toggle="tab">合同状态</router-link>
        </li>
        <li>
          <router-link to="/home/TypeGrouping/Source" href="#tab_12" data-toggle="tab">游戏来源</router-link>
        </li>
      </ul>
    </div>
    <div class="tab-content">
      <div class="content">
        <div class="row">
          <div class="col-sm-12">
            <div class="box">
              <router-view></router-view>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style type="text/css">
  .breadcrumb > .active > a {
    color: red !important;
  }

  .breadcrumb > li > a {
    color: #000;
  }
</style>
