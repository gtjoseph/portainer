package kubernetes

type K8sMetrics struct {
	Resources []K8sMetricsResources `json:"resources"`
}

type K8sMetricsResources struct {
	Kind         string   `json:"kind,omitempty"`
	Name         string   `json:"name,omitempty"`
	Namespaced   bool     `json:"namespaced,omitempty"`
	SingularName string   `json:"singular_name,omitempty"`
	Verbs        []string `json:"verbs,omitempty"`
}
