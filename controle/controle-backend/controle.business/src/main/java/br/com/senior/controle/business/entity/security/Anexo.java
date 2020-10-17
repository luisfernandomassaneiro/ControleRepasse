package br.com.senior.controle.business.entity.security;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@Entity
@Table(name = "anexo")
@Inheritance(strategy = InheritanceType.JOINED)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Anexo {

	@Id
	@Column(name = "id")
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	@JsonIgnore
	@Lob
	@Basic(fetch = FetchType.LAZY)
	private byte[] file;

	@Column(name = "file_name", nullable = false)
	private String fileName;

	@Column(name = "mime_type")
	private String mimeType;

	@ManyToOne
	@JoinColumn(name = "carro_id", nullable = false)
	private Carro carro;

}
